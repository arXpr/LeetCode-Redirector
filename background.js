// Fetch the sitemap and build the mapping list
async function buildMapping() {
    try {
        console.log("Fetching latest LeetCode.ca sitemap...");
        const response = await fetch("https://leetcode.ca/sitemap.xml");
        const text = await response.text();

        // Regex to find all <loc> URLs
        const locRegex = /<loc>(.*?)<\/loc>/g;
        let match;
        const mapping = {};

        while ((match = locRegex.exec(text)) !== null) {
            const url = match[1];
            
            // Extract the slug (e.g., matching "2015-12-01-1-Two-Sum")
            const slugMatch = url.match(/\/\d{4}-\d{2}-\d{2}-(?:(\d+)-)?(.*?)\/?$/);
            if (slugMatch && slugMatch[2]) {
                // Normalize the slug to match leetcode.com URL structures perfectly
                let slug = slugMatch[2]
                    .toLowerCase()
                    .replace(/\(/g, '')
                    .replace(/\)/g, '')
                    .replace(/,/g, '')
                    .replace(/'/g, '')
                    .replace(/\s+/g, '-');
                
                mapping[slug] = url;
            }
        }

        // Save the map to chrome storage
        await chrome.storage.local.set({ leetcodeMap: mapping });
        console.log("Successfully mapped " + Object.keys(mapping).length + " premium problems.");
    } catch (error) {
        console.error("Failed to fetch sitemap:", error);
    }
}

// Build map on install, update, and browser start
chrome.runtime.onInstalled.addListener(buildMapping);
chrome.runtime.onStartup.addListener(buildMapping);

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkPremium") {
        chrome.storage.local.get("leetcodeMap", (data) => {
            const map = data.leetcodeMap || {};
            const targetUrl = map[request.slug];
            sendResponse({ redirectUrl: targetUrl });
        });
        return true; // Tells Chrome we will send the response asynchronously
    }
});