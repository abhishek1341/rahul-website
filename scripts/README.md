# Google Form Automation Script

This script automates filling out a Google Form 250 times with unique Indian-Gujarati data for testing purposes.

## Features

- ✅ Generates 250 unique responses
- ✅ Indian-Gujarati names and phone numbers
- ✅ Unique email addresses
- ✅ Handles multi-page forms
- ✅ Uses incognito mode (no sign-in required)
- ✅ Random delays to appear more human-like
- ✅ Automatically fills all form fields

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Usage

Run the automation script:
```bash
npm run fill-form
```

The script will:
- Open a browser window (you can watch it work)
- Fill out the form 250 times with unique data
- Show progress in the console
- Display a summary at the end

## Configuration

You can modify the script to:
- Change the number of responses (edit `totalResponses` in `fill-google-form.ts`)
- Run in headless mode (set `headless: true` in the browser launch options)
- Adjust delays between submissions
- Modify the form URL if needed

## Notes

- The script uses random delays to avoid being detected as a bot
- Each submission uses a fresh browser context (incognito mode)
- If a submission fails, it will continue with the next one
- The script handles text inputs, radio buttons, dropdowns, and checkboxes automatically

## Troubleshooting

If you encounter issues:
1. Make sure Playwright is installed: `npx playwright install chromium`
2. Check that the form URL is correct and accessible
3. Verify the form doesn't require CAPTCHA (this script doesn't handle CAPTCHAs)
4. If the form structure changes, you may need to update the selectors in the script









