let isRedirecting = false;
let lastUrl = location.href;

// Extract the problem slug from the URL (e.g., "two-sum")
function getProblemSlug() {
    const match = window.location.pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1] : null;
}

function checkPaywall() {
    if (isRedirecting) return; // Prevent spamming the redirect
    
    const slug = getProblemSlug();
    if (!slug) return;

    // Search the entire visible text of the page for LeetCode's premium prompts
    const pageText = document.body.innerText || "";
    if (pageText.includes("Subscribe to unlock") || pageText.includes("Premium subscription is required")) {
        
        isRedirecting = true; // Lock it so it doesn't trigger 100 times a second
        console.log("Paywall detected for:", slug);

        chrome.runtime.sendMessage({ action: "checkPremium", slug: slug }, (response) => {
            if (response && response.redirectUrl) {
                console.log("Redirecting to:", response.redirectUrl);
                window.location.replace(response.redirectUrl);
            } else {
                console.log("No solution found on leetcode.ca for this problem.");
                isRedirecting = false; // Unlock if no URL was found
            }
        });
    }
}

// 1. Observe the page constantly for DOM changes (catches the paywall the second it renders)
const domObserver = new MutationObserver(() => {
    // Reset our lock if the user navigated to a completely different URL
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        isRedirecting = false; 
    }
    checkPaywall();
});

// Start watching the body
if (document.body) {
    domObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
} else {
    // Fallback if script loads before body
    document.addEventListener("DOMContentLoaded", () => {
        domObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
}