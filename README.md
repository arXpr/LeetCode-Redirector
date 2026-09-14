# LeetCode Premium Redirector

A Chrome/Chromium browser extension that detects premium LeetCode problem pages and redirects users to the matching problem on leetcode.ca when available.

## Overview

This extension is designed for users who want to access premium LeetCode problems without a subscription. It works by:

- monitoring LeetCode problem pages
- checking for common premium paywall text
- matching the problem slug to a public mirror on leetcode.ca
- redirecting automatically when a valid mapping exists

## Features

- automatic detection of premium paywall pages
- sitemap-based problem mapping
- redirect logic powered by browser storage cache
- lightweight content script with no external dependency on page code

## Project Structure

- `manifest.json` — extension manifest and permissions
- `background.js` — builds the slug-to-URL mapping from the leetcode.ca sitemap and serves redirect lookups
- `content.js` — watches the page for premium paywalls and triggers the redirect

## How It Works

1. The extension installs and fetches the sitemap from leetcode.ca.
2. The sitemap is parsed to extract problem URLs and their slugs.
3. When a LeetCode problem page displays a premium notice, the content script reads the current problem slug.
4. The background script looks up the matching mirror URL in cached storage.
5. The browser redirects to the mirror page.

## Installation

1. Open Chrome and go to `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this project folder.
5. Visit a premium LeetCode problem page to test the redirect.

## Permissions

The extension requests:

- `storage` to cache the problem mapping locally
- access to `leetcode.com/problems/*` and `https://leetcode.ca/*` for detection and redirecting

## Notes

- The redirect target depends on the availability and structure of the public mirror site.
- The mapping is refreshed on install and browser startup.
- This project is intended for educational or personal use and may require updating if the mirror structure changes.

## License

This project is provided as-is for local use and experimentation.
