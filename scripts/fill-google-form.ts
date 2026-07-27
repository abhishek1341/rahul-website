import { chromium, Page } from 'playwright';

// Indian-Gujarati names database
const gujaratiFirstNames = [
  'Rahul', 'Karan', 'Harsh', 'Jay', 'Meet', 'Dhruv', 'Vishal', 'Nikhil',
  'Parth', 'Rohan', 'Kunal', 'Amit', 'Raj', 'Vikram', 'Siddharth',
  'Priya', 'Kavya', 'Ananya', 'Isha', 'Riya', 'Sneha', 'Neha', 'Pooja',
  'Divya', 'Shreya', 'Aishwarya', 'Meera', 'Radha', 'Kiran', 'Nisha'
];

const gujaratiLastNames = [
  'Patel', 'Shah', 'Desai', 'Mehta', 'Joshi', 'Amin', 'Gandhi', 'Modi',
  'Parekh', 'Bhatt', 'Dave', 'Vyas', 'Trivedi', 'Shukla', 'Pandya',
  'Solanki', 'Chauhan', 'Rathod', 'Makwana', 'Vaghela', 'Thakkar', 'Soni'
];

// Gujarat area codes and phone number patterns
const gujaratAreaCodes = ['79', '265', '266', '267', '268', '269', '275', '276', '277', '278', '279'];

/**
 * Generate a random Indian-Gujarati name
 */
function generateGujaratiName(): { firstName: string; lastName: string; fullName: string } {
  const firstName = gujaratiFirstNames[Math.floor(Math.random() * gujaratiFirstNames.length)];
  const lastName = gujaratiLastNames[Math.floor(Math.random() * gujaratiLastNames.length)];
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`
  };
}

/**
 * Generate a random Indian phone number (10 digits, Gujarat)
 */
function generateGujaratiPhoneNumber(): string {
  const areaCode = gujaratAreaCodes[Math.floor(Math.random() * gujaratAreaCodes.length)];
  // Generate remaining digits to make exactly 10 digits total
  if (areaCode.length === 2) {
    // 2-digit area code (like 79) - need 8 more digits
    const remainingDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    return `${areaCode}${remainingDigits}`;
  } else {
    // 3-digit area code (like 265) - need 7 more digits
    const remainingDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
    return `${areaCode}${remainingDigits}`;
  }
}

/**
 * Generate a unique email address (gmail.com only)
 */
function generateEmail(firstName: string, lastName: string, index: number): string {
  const randomNum = Math.floor(Math.random() * 10000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}${index}@gmail.com`;
}

/**
 * Wait for a random delay to appear more human-like
 */
function randomDelay(min: number = 500, max: number = 2000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Fill a text input by finding it through various methods
 */
async function fillTextInput(page: Page, value: string, fieldType: 'name' | 'email' | 'phone'): Promise<boolean> {
  try {
    // Try multiple selectors to find the input
    const selectors = [
      `input[type="text"]`,
      `input[type="email"]`,
      `input[type="tel"]`,
      `input[aria-label*="${fieldType === 'name' ? 'name' : fieldType === 'email' ? 'email' : 'contact'}" i]`,
      `input[placeholder*="${fieldType === 'name' ? 'name' : fieldType === 'email' ? 'email' : 'contact'}" i]`
    ];

    for (const selector of selectors) {
      const inputs = await page.locator(selector).all();
      for (const input of inputs) {
        const isVisible = await input.isVisible().catch(() => false);
        if (!isVisible) continue;

        const currentValue = await input.inputValue().catch(() => '');
        if (currentValue && currentValue.trim().length > 0) continue; // Already filled

        const ariaLabel = (await input.getAttribute('aria-label') || '').toLowerCase();
        const placeholder = (await input.getAttribute('placeholder') || '').toLowerCase();
        const inputType = (await input.getAttribute('type') || '').toLowerCase();

        // Check if this input matches our field type
        const matches = 
          (fieldType === 'name' && (ariaLabel.includes('name') || placeholder.includes('name'))) ||
          (fieldType === 'email' && (ariaLabel.includes('email') || placeholder.includes('email') || inputType === 'email')) ||
          (fieldType === 'phone' && (ariaLabel.includes('contact') || ariaLabel.includes('phone') || ariaLabel.includes('mobile') || placeholder.includes('contact') || placeholder.includes('phone') || inputType === 'tel'));

        if (matches) {
          await input.click();
          await randomDelay(200, 400);
          await input.fill(value);
          await randomDelay(400, 700);
          console.log(`      ✓ Filled ${fieldType}: ${value}`);
          return true;
        }
      }
    }

    // Fallback: fill first empty text input if we haven't found a match
    const allInputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"]').all();
    for (const input of allInputs) {
      const isVisible = await input.isVisible().catch(() => false);
      if (!isVisible) continue;
      const currentValue = await input.inputValue().catch(() => '');
      if (!currentValue || currentValue.trim().length === 0) {
        await input.click();
        await randomDelay(200, 400);
        await input.fill(value);
        await randomDelay(400, 700);
        console.log(`      ✓ Filled ${fieldType} (fallback): ${value}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.log(`      ⚠ Could not fill ${fieldType}`);
    return false;
  }
}

/**
 * Select a radio button option by text (finds first unfilled radio group)
 */
async function selectRadioByText(page: Page, optionText: string): Promise<boolean> {
  try {
    // Get all radio groups
    const radioGroups = await page.locator('div[role="radiogroup"]').all();
    
    for (const group of radioGroups) {
      const isVisible = await group.isVisible().catch(() => false);
      if (!isVisible) continue;

      // Check if this group already has a selection
      const options = await group.locator('span[role="radio"], div[role="radio"]').all();
      let hasSelection = false;
      
      for (const opt of options) {
        const checked = await opt.getAttribute('aria-checked').catch(() => 'false');
        if (checked === 'true') {
          hasSelection = true;
          break;
        }
      }

      // If no selection, try to find and click the option
      if (!hasSelection) {
        for (const opt of options) {
          const text = await opt.textContent().catch(() => '');
          if (text && text.trim().includes(optionText)) {
            await opt.scrollIntoViewIfNeeded();
            await randomDelay(200, 400);
            await opt.click();
            await randomDelay(400, 700);
            console.log(`      ✓ Selected radio: ${optionText}`);
            return true;
          }
        }
      }
    }
    
    // Fallback: try direct text matching
    const radio = page.locator(`span[role="radio"]:has-text("${optionText}"), div[role="radio"]:has-text("${optionText}"), label:has-text("${optionText}")`).first();
    const isVisible = await radio.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      const checked = await radio.getAttribute('aria-checked').catch(() => 'false');
      if (checked !== 'true') {
        await radio.scrollIntoViewIfNeeded();
        await randomDelay(200, 400);
        await radio.click();
        await randomDelay(400, 700);
        console.log(`      ✓ Selected radio (fallback): ${optionText}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.log(`      ⚠ Could not select radio: ${optionText}`);
    return false;
  }
}

/**
 * Select a dropdown option by text (finds first unfilled dropdown)
 */
async function selectDropdownByText(page: Page, optionText: string): Promise<boolean> {
  try {
    // Get all dropdowns
    const dropdowns = await page.locator('div[role="listbox"], div[aria-haspopup="listbox"]').all();
    
    for (const dropdown of dropdowns) {
      const isVisible = await dropdown.isVisible().catch(() => false);
      if (!isVisible) continue;

      // Check if already has a value
      const currentText = await dropdown.textContent().catch(() => '');
      if (currentText && currentText.trim().length > 0 && !currentText.includes('Choose') && !currentText.includes('Select')) {
        continue; // Already filled
      }

      // Try to open and select
      await dropdown.scrollIntoViewIfNeeded();
      await randomDelay(200, 400);
      await dropdown.click();
      await randomDelay(500, 800);
      
      // Find and click the option
      const options = await page.locator('div[role="option"]').all();
      for (const opt of options) {
        const text = await opt.textContent().catch(() => '');
        if (text && text.trim().includes(optionText)) {
          await opt.click();
          await randomDelay(400, 700);
          console.log(`      ✓ Selected dropdown: ${optionText}`);
          return true;
        }
      }
      
      // Close dropdown if option not found
      await page.keyboard.press('Escape');
      await randomDelay(200, 400);
    }
    
    return false;
  } catch (error) {
    console.log(`      ⚠ Could not select dropdown: ${optionText}`);
    return false;
  }
}

/**
 * Fill a grid question (like the lifestyle impact question)
 * Each row needs exactly one selection from the columns
 */
async function fillGridQuestion(page: Page, numRows: number, numColumns: number): Promise<void> {
  try {
    console.log(`      Filling grid question (${numRows} rows x ${numColumns} columns)...`);
    
    // Find all radio groups - each group represents one row
    const radioGroups = await page.locator('div[role="radiogroup"]').all();
    
    // Process each radio group (each row)
    for (let rowIndex = 0; rowIndex < Math.min(radioGroups.length, numRows); rowIndex++) {
      const group = radioGroups[rowIndex];
      const isVisible = await group.isVisible().catch(() => false);
      if (!isVisible) continue;

      const options = await group.locator('span[role="radio"], div[role="radio"]').all();
      
      if (options.length >= numColumns) {
        // Check if any option is already selected
        let hasSelection = false;
        for (const opt of options) {
          const checked = await opt.getAttribute('aria-checked').catch(() => 'false');
          if (checked === 'true') {
            hasSelection = true;
            break;
          }
        }

        if (!hasSelection) {
          // Select a random column (0 to numColumns-1)
          const randomCol = Math.floor(Math.random() * numColumns);
          const option = options[randomCol];
          
          await option.scrollIntoViewIfNeeded();
          await randomDelay(200, 400);
          await option.click();
          await randomDelay(300, 500);
        }
      }
    }
    console.log(`      ✓ Filled grid question (${Math.min(radioGroups.length, numRows)} rows)`);
  } catch (error) {
    console.log(`      ⚠ Could not fill grid question: ${error}`);
  }
}

/**
 * Select a Likert scale option (1-5) - finds first unfilled Likert scale
 */
async function selectLikertScale(page: Page, minValue: number = 1, maxValue: number = 5): Promise<void> {
  try {
    // Get all radio groups
    const radioGroups = await page.locator('div[role="radiogroup"]').all();
    
    for (const group of radioGroups) {
      const isVisible = await group.isVisible().catch(() => false);
      if (!isVisible) continue;

      const options = await group.locator('span[role="radio"], div[role="radio"]').all();
      
      // Check if this looks like a Likert scale (has 5 options with numbers 1-5)
      if (options.length >= maxValue) {
        // Check if already has a selection
        let hasSelection = false;
        for (const opt of options) {
          const checked = await opt.getAttribute('aria-checked').catch(() => 'false');
          if (checked === 'true') {
            hasSelection = true;
            break;
          }
        }

        if (!hasSelection) {
          // Select a random value between min and max
          const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue - 1;
          const option = options[randomValue];
          
          await option.scrollIntoViewIfNeeded();
          await randomDelay(200, 400);
          await option.click();
          await randomDelay(400, 700);
          console.log(`      ✓ Selected Likert scale: ${randomValue + 1}`);
          return; // Found and filled one, exit
        }
      }
    }
  } catch (error) {
    console.log(`      ⚠ Could not select Likert scale`);
  }
}

/**
 * Fill Section 1
 */
async function fillSection1(page: Page, data: { name: string; phone: string; email: string }): Promise<void> {
  console.log('  Filling Section 1...');
  
  await page.waitForLoadState('domcontentloaded');
  await randomDelay(1000, 1500);

  // 1. Name
  await fillTextInput(page, data.name, 'name');
  await randomDelay(300, 500);
  
  // 2. Contact No
  await fillTextInput(page, data.phone, 'phone');
  await randomDelay(300, 500);
  
  // 3. Email
  await fillTextInput(page, data.email, 'email');
  await randomDelay(300, 500);
  
  // 4. Age - Radio "18-25"
  await selectRadioByText(page, '18-25');
  await randomDelay(300, 500);
  
  // 5. Gender - Select Male/Female (alternate)
  const genderOptions = ['Male', 'Female'];
  const genderIndex = Math.floor(Math.random() * genderOptions.length);
  await selectRadioByText(page, genderOptions[genderIndex]);
  await randomDelay(300, 500);
  
  // 6. Occupation - Select "Student"
  let filled = await selectDropdownByText(page, 'Student');
  if (!filled) {
    // Try to find any unfilled dropdown and select Student
    const dropdowns = await page.locator('div[role="listbox"], div[aria-haspopup="listbox"]').all();
    for (const dropdown of dropdowns) {
      const currentText = await dropdown.textContent().catch(() => '');
      if (!currentText || currentText.trim().length === 0 || currentText.includes('Choose') || currentText.includes('Select')) {
        await dropdown.scrollIntoViewIfNeeded();
        await dropdown.click();
        await randomDelay(500, 800);
        const options = await page.locator('div[role="option"]').all();
        for (const opt of options) {
          const text = await opt.textContent().catch(() => '');
          if (text && (text.includes('Student') || text.includes('student'))) {
            await opt.click();
            await randomDelay(400, 700);
            console.log(`      ✓ Selected dropdown: Student`);
            filled = true;
            break;
          }
        }
        if (filled) break;
        // Close dropdown if not found
        await page.keyboard.press('Escape');
        await randomDelay(200, 400);
      }
    }
  }
  await randomDelay(300, 500);
  
  // 7. Monthly income - Select "Below ₹20000"
  filled = await selectDropdownByText(page, 'Below ₹20000');
  if (!filled) {
    filled = await selectDropdownByText(page, 'Below 20000');
    if (!filled) {
      filled = await selectDropdownByText(page, '20000');
      if (!filled) {
        // Try to find any remaining unfilled dropdown
        const dropdowns = await page.locator('div[role="listbox"], div[aria-haspopup="listbox"]').all();
        for (const dropdown of dropdowns) {
          const currentText = await dropdown.textContent().catch(() => '');
          if (!currentText || currentText.trim().length === 0 || currentText.includes('Choose') || currentText.includes('Select')) {
            await dropdown.scrollIntoViewIfNeeded();
            await dropdown.click();
            await randomDelay(500, 800);
            const options = await page.locator('div[role="option"]').all();
            for (const opt of options) {
              const text = await opt.textContent().catch(() => '');
              if (text && (text.includes('20000') || text.includes('Below'))) {
                await opt.click();
                await randomDelay(400, 700);
                console.log(`      ✓ Selected dropdown: ${text.trim()}`);
                filled = true;
                break;
              }
            }
            if (filled) break;
            await page.keyboard.press('Escape');
            await randomDelay(200, 400);
          }
        }
      }
    }
  }
  await randomDelay(300, 500);
  
  // 8. Do you use hyper local delivery apps? - Select "Yes"
  await selectRadioByText(page, 'Yes');
  
  await randomDelay(500, 1000);
}

/**
 * Fill Section 2
 */
async function fillSection2(page: Page): Promise<void> {
  console.log('  Filling Section 2...');
  
  await page.waitForLoadState('domcontentloaded');
  await randomDelay(1000, 1500);

  // 1. Which hyperlocal delivery apps do you use? - Alternate between options
  const appOptions = ['Swiggy- Instamart', 'Big basket', 'Zomato- blinkit'];
  const appIndex = Math.floor(Math.random() * appOptions.length);
  let filled = await selectRadioByText(page, appOptions[appIndex]);
  if (!filled) {
    // Try alternative text matching
    for (const opt of appOptions) {
      filled = await selectRadioByText(page, opt);
      if (filled) break;
    }
  }
  
  // 2. How often do you use these apps? - Select "weekly" or "Bi-weekly"
  const frequencyOptions = ['weekly', 'Bi-weekly', 'Weekly', 'Bi-Weekly'];
  const freqIndex = Math.floor(Math.random() * frequencyOptions.length);
  filled = await selectRadioByText(page, frequencyOptions[freqIndex]);
  if (!filled) {
    for (const opt of frequencyOptions) {
      filled = await selectRadioByText(page, opt);
      if (filled) break;
    }
  }
  
  // 3. What do you mostly order through these apps? - Select one
  const orderOptions = ['Food from restaurants', 'Groceries and daily essentials'];
  const orderIndex = Math.floor(Math.random() * orderOptions.length);
  filled = await selectRadioByText(page, orderOptions[orderIndex]);
  if (!filled) {
    for (const opt of orderOptions) {
      filled = await selectRadioByText(page, opt);
      if (filled) break;
    }
  }
  
  // 4. What motivates you most to use hyperlocal apps? - Select one
  const motivationOptions = ['Convenience', 'Discount/offers', 'Discount', 'Offers'];
  const motivationIndex = Math.floor(Math.random() * motivationOptions.length);
  filled = await selectRadioByText(page, motivationOptions[motivationIndex]);
  if (!filled) {
    for (const opt of motivationOptions) {
      filled = await selectRadioByText(page, opt);
      if (filled) break;
    }
  }
  
  // 5. How much do you spend on these apps monthly? - Select one
  const spendOptions = ['₹2000-₹5000', 'Below ₹2000', '2000-5000', 'Below 2000'];
  const spendIndex = Math.floor(Math.random() * spendOptions.length);
  filled = await selectRadioByText(page, spendOptions[spendIndex]);
  if (!filled) {
    for (const opt of spendOptions) {
      filled = await selectRadioByText(page, opt);
      if (filled) break;
    }
  }
  
  await randomDelay(500, 1000);
}

/**
 * Fill Section 3
 */
async function fillSection3(page: Page): Promise<void> {
  console.log('  Filling Section 3...');
  
  await page.waitForLoadState('domcontentloaded');
  await randomDelay(1000, 1500);

  // 1. How have hyperlocal delivery apps impacted your overall lifestyle? - Grid (5 rows x 5 columns)
  await fillGridQuestion(page, 5, 5);
  
  // 2. Do hyperlocal delivery apps make you spend more impulsively? - Select "Yes, very often"
  let filled = await selectRadioByText(page, 'Yes, very often');
  if (!filled) {
    filled = await selectRadioByText(page, 'Yes');
    if (!filled) await selectRadioByText(page, 'very often');
  }
  
  // 3. How much money do you usually spend on impulsive buying? - Select "Below Rs500"
  filled = await selectRadioByText(page, 'Below Rs500');
  if (!filled) {
    filled = await selectRadioByText(page, 'Below Rs 500');
    if (!filled) await selectRadioByText(page, 'Below');
  }
  
  // 4. How have these apps influenced your shopping habits? - Select "Increased impulsive buying"
  filled = await selectRadioByText(page, 'Increased impulsive buying');
  if (!filled) {
    filled = await selectRadioByText(page, 'Increased');
    if (!filled) await selectRadioByText(page, 'impulsive buying');
  }
  
  // 5. Do you feel hyperlocal apps have made your lifestyle more convenient? - Likert scale 1-5
  await selectLikertScale(page, 1, 5);
  
  await randomDelay(500, 1000);
}

/**
 * Fill Section 4
 */
async function fillSection4(page: Page): Promise<void> {
  console.log('  Filling Section 4...');
  
  await page.waitForLoadState('domcontentloaded');
  await randomDelay(1000, 1500);

  // 1. Rate your satisfaction with the following aspects - Grid (5 rows x 5 columns)
  await fillGridQuestion(page, 5, 5);
  
  // 2. Do you believe hyperlocal delivery apps have made people more dependent on technology? - Likert scale 1-5
  await selectLikertScale(page, 1, 5);
  
  // 3. Overall, do you consider hyperlocal delivery apps a positive influence? - Likert scale 1-5
  await selectLikertScale(page, 1, 5);
  
  await randomDelay(500, 1000);
}

/**
 * Navigate to next section or submit
 */
async function goToNextSection(page: Page): Promise<boolean> {
  try {
    await randomDelay(500, 800);

    // Look for Next button
    const nextButton = page.locator('div[role="button"]:has-text("Next"), span:has-text("Next"), button:has-text("Next")').first();
    const isNextVisible = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isNextVisible) {
      await nextButton.scrollIntoViewIfNeeded();
      await randomDelay(300, 500);
      await nextButton.click();
      console.log('    → Clicked Next button');
      await randomDelay(2000, 3000);
      return true;
    }

    // Look for Submit button
    const submitButton = page.locator('div[role="button"]:has-text("Submit"), span:has-text("Submit"), button:has-text("Submit")').first();
    const isSubmitVisible = await submitButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isSubmitVisible) {
      await submitButton.scrollIntoViewIfNeeded();
      await randomDelay(500, 800);
      await submitButton.click();
      console.log('    → Clicked Submit button');
      await randomDelay(3000, 4000);
      return false;
    }

    return false;
  } catch (error) {
    console.log('    ⚠ Could not find Next/Submit button');
    return false;
  }
}

/**
 * Fill out the Google Form (all 4 sections)
 */
async function fillForm(page: Page, data: {
  name: string;
  phone: string;
  email: string;
}): Promise<void> {
  try {
    console.log('  Starting form fill...');
    
    await page.waitForLoadState('networkidle');
    await randomDelay(2000, 3000);

    // Section 1
    await fillSection1(page, data);
    await goToNextSection(page);

    // Section 2
    await fillSection2(page);
    await goToNextSection(page);

    // Section 3
    await fillSection3(page);
    await goToNextSection(page);

    // Section 4
    await fillSection4(page);
    await goToNextSection(page); // This should submit

    // Verify submission
    await randomDelay(2000, 3000);
    const submitAnother = page.locator('a:has-text("Submit another response"), div:has-text("Your response has been recorded")').first();
    const isVisible = await submitAnother.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isVisible) {
      console.log('  ✓ Submission confirmed!');
    } else {
      console.log('  ⚠ Could not confirm submission, but continuing...');
    }

  } catch (error) {
    console.error('  ✗ Error filling form:', error);
    throw error;
  }
}

/**
 * Main function to submit responses
 */
async function main() {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe-sDSCUOAT12TZRGL5G5NIyqDAf-2H3UwYrH5uPrqC8Znbhg/viewform';
  const totalResponses = 1;

  console.log(`Starting to fill Google Form ${totalResponses} times...`);
  console.log(`Form URL: ${formUrl}\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--incognito']
  });

  let successCount = 0;
  let failCount = 0;

  try {
    for (let i = 0; i < totalResponses; i++) {
      try {
        console.log(`\n[${i + 1}/${totalResponses}] Processing response...`);

        const context = await browser.newContext({
          viewport: { width: 1920, height: 1080 },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();

        const nameData = generateGujaratiName();
        const phone = generateGujaratiPhoneNumber();
        const email = generateEmail(nameData.firstName, nameData.lastName, i);

        console.log(`  Name: ${nameData.fullName}`);
        console.log(`  Email: ${email}`);
        console.log(`  Phone: ${phone}`);

        await page.goto(formUrl, { waitUntil: 'networkidle' });
        await randomDelay(2000, 3000);

        await fillForm(page, {
          name: nameData.fullName,
          phone: phone,
          email: email
        });

        await context.close();

        successCount++;
        console.log(`  ✓ Successfully submitted response ${i + 1}`);

        if (i < totalResponses - 1) {
          const delay = Math.floor(Math.random() * 5000) + 5000;
          console.log(`  Waiting ${delay / 1000}s before next submission...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        failCount++;
        console.error(`  ✗ Failed to submit response ${i + 1}:`, error);
        await randomDelay(2000, 3000);
      }
    }

    console.log(`\n\n=== Summary ===`);
    console.log(`Total responses attempted: ${totalResponses}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Success rate: ${((successCount / totalResponses) * 100).toFixed(2)}%`);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
