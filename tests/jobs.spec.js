const { test, expect } = require('@playwright/test');

const URL = 'https://devadminbwt.netlify.app';
const EMAIL = 'bharathipriya.works+21@blackwinstech.com';
const PASSWORD = 'pcclbu62';

async function login(page) {
  await page.goto(`${URL}/login`);

  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);

  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');
}

async function goToCreateJob(page) {
  await page.goto(`${URL}/admin/create-job`);
  await page.waitForLoadState('networkidle');
}

test('should fill and submit the create-job form', async ({ page }) => {

  await login(page);
  await goToCreateJob(page);

await page.locator('input[name="title"]').fill('Software Tester');
// Job Type
await page.getByRole('combobox').nth(0).click();
await page.getByRole('option', {
  name: 'Full-time',
  exact: true
}).click();

// Job Status
await page.getByRole('combobox').nth(1).click();
await page.getByRole('option', {
  name: 'Open',
  exact: true
}).click();

// Experience
await page.getByRole('combobox').nth(2).click();
await page.getByRole('option', {
  name: '2 to 5 yrs',
  exact: true
}).click();

// Industry
await page.locator('input[name="domain"]').fill('Information Technology');
// Open Skills popup
await page.getByRole('button', {
  name: /select or search skills|skill\(s\) selected/i
}).click();

// Search skill
await page.getByPlaceholder('Search skills...').fill('Java');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
await page.locator('input[name="contactName"]').fill('6787898989');

// Date Opened
// Date Opened
await page.getByText('Date Opened').locator('..')
  .getByRole('button')
  .click();

await page.getByRole('gridcell', { name: '9', exact: true }).click();

await page.getByText('Target Date')
  .locator('..')
  .getByRole('button')
  .click();

await page.getByRole('gridcell', { name: '15', exact: true })
  .last()
  .click();
  await page.locator('input[name="location"]').fill('trichy');
  await page.locator('.ql-editor').click();
await page.locator('.ql-editor').fill(
  'We are looking for a Software Tester with experience in manual testing and bug reporting.'
);

await page.getByText('Save & Publish').click();

// Example success validation

});

