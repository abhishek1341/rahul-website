import { chromium } from 'playwright';

/**
 * Diagnostic script to inspect Google Form structure
 * This will help us understand the exact field structure
 */
async function inspectForm() {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe-sDSCUOAT12TZRGL5G5NIyqDAf-2H3UwYrH5uPrqC8Znbhg/viewform';

  console.log('Inspecting Google Form structure...\n');
  console.log(`Form URL: ${formUrl}\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--incognito']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    await page.goto(formUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('=== FORM STRUCTURE ANALYSIS ===\n');

    // Get all form sections
    const sections = await page.locator('div[role="list"] > div').all();
    console.log(`Found ${sections.length} sections\n`);

    let questionNumber = 1;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const sectionTitle = await section.locator('div[role="heading"]').first().textContent().catch(() => 'Section ' + (sectionIndex + 1));
      
      console.log(`\n--- SECTION ${sectionIndex + 1}: ${sectionTitle || 'Untitled'} ---`);

      // Get all questions in this section
      const questions = await section.locator('div[role="listitem"]').all();
      console.log(`  Questions in this section: ${questions.length}\n`);

      for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        const question = questions[qIndex];
        
        try {
          // Get question text
          const questionText = await question.locator('span[dir="auto"]').first().textContent().catch(() => '');
          const questionLabel = await question.locator('div[role="heading"]').first().textContent().catch(() => '');
          const fullQuestion = (questionText || questionLabel || `Question ${questionNumber}`).trim();
          
          console.log(`  Q${questionNumber}: ${fullQuestion}`);

          // Check for text inputs
          const textInputs = await question.locator('input[type="text"], input[type="email"], input[type="tel"], textarea').all();
          if (textInputs.length > 0) {
            for (const input of textInputs) {
              const ariaLabel = await input.getAttribute('aria-label') || '';
              const inputType = await input.getAttribute('type') || 'text';
              const placeholder = await input.getAttribute('placeholder') || '';
              console.log(`    → Text Input (${inputType}): "${ariaLabel || placeholder || 'No label'}"`);
            }
          }

          // Check for radio buttons
          const radioGroups = await question.locator('div[role="radiogroup"]').all();
          if (radioGroups.length > 0) {
            for (const group of radioGroups) {
              const options = await group.locator('span[role="radio"]').all();
              const optionTexts: string[] = [];
              for (const opt of options) {
                const text = await opt.textContent().catch(() => '');
                if (text) optionTexts.push(text.trim());
              }
              console.log(`    → Radio Buttons: [${optionTexts.join(', ')}]`);
            }
          }

          // Check for checkboxes
          const checkboxGroups = await question.locator('div[role="group"]').all();
          if (checkboxGroups.length > 0) {
            for (const group of checkboxGroups) {
              const checkboxes = await group.locator('div[role="checkbox"]').all();
              const checkboxTexts: string[] = [];
              for (const cb of checkboxes) {
                const text = await cb.textContent().catch(() => '');
                if (text) checkboxTexts.push(text.trim());
              }
              if (checkboxTexts.length > 0) {
                console.log(`    → Checkboxes: [${checkboxTexts.join(', ')}]`);
              }
            }
          }

          // Check for dropdowns
          const selects = await question.locator('select, div[role="listbox"]').all();
          if (selects.length > 0) {
            for (const select of selects) {
              const tagName = await select.evaluate(el => el.tagName.toLowerCase());
              if (tagName === 'select') {
                const options = await select.locator('option').all();
                const optionTexts: string[] = [];
                for (const opt of options) {
                  const text = await opt.textContent().catch(() => '');
                  if (text) optionTexts.push(text.trim());
                }
                console.log(`    → Dropdown (select): [${optionTexts.join(', ')}]`);
              } else {
                const ariaLabel = await select.getAttribute('aria-label') || '';
                console.log(`    → Dropdown (custom): "${ariaLabel}"`);
              }
            }
          }

          // Check for date/time pickers
          const dateInputs = await question.locator('input[type="date"], input[type="time"], input[type="datetime-local"]').all();
          if (dateInputs.length > 0) {
            for (const input of dateInputs) {
              const inputType = await input.getAttribute('type') || '';
              const ariaLabel = await input.getAttribute('aria-label') || '';
              console.log(`    → Date/Time Input (${inputType}): "${ariaLabel}"`);
            }
          }

          // Check for file upload
          const fileInputs = await question.locator('input[type="file"]').all();
          if (fileInputs.length > 0) {
            console.log(`    → File Upload`);
          }

          // Check for scale/linear scale
          const scales = await question.locator('div[role="radiogroup"]').all();
          if (scales.length > 0) {
            const scaleLabels = await question.locator('span[dir="auto"]').all();
            if (scaleLabels.length >= 2) {
              const leftLabel = await scaleLabels[0].textContent().catch(() => '');
              const rightLabel = await scaleLabels[scaleLabels.length - 1].textContent().catch(() => '');
              console.log(`    → Linear Scale: "${leftLabel}" to "${rightLabel}"`);
            }
          }

          questionNumber++;
        } catch (error) {
          console.log(`    ⚠ Error inspecting question ${qIndex + 1}: ${error}`);
        }
      }

      // Check for Next button
      const nextButton = await page.locator('div[role="button"]:has-text("Next")').first().isVisible().catch(() => false);
      if (nextButton) {
        console.log(`\n  → Has "Next" button to go to next section`);
      }
    }

    // Check for Submit button
    const submitButton = await page.locator('div[role="button"]:has-text("Submit")').first().isVisible().catch(() => false);
    if (submitButton) {
      console.log(`\n  → Has "Submit" button on final section`);
    }

    console.log('\n\n=== INSPECTION COMPLETE ===');
    console.log('\nPlease copy the output above and share it so I can create a precise script!');
    console.log('\nPress Enter to close the browser...');
    
    // Keep browser open for 30 seconds so user can review
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error inspecting form:', error);
  } finally {
    await browser.close();
  }
}

inspectForm().catch(console.error);









