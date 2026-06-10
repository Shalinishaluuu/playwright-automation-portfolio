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

test.describe('Create Employee', () => {

  let employeeEmail;

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Create Employee - Complete Flow', async ({ page }) => {

    employeeEmail = `shalini${Date.now()}@gmail.com`;

    await page.goto(`${URL}/admin/employee/create`);

    await page.getByPlaceholder('Enter employee firstname').fill('Shalini');
    await page.getByPlaceholder('Enter employee  lastname').fill('Kumar');
    await page.getByPlaceholder('Enter email address').fill(employeeEmail);
    await page.getByPlaceholder('Enter phone number').fill('6380123838');

    // Department
    const comboboxes = page.getByRole('combobox');

    await comboboxes.nth(0).click();
    await page.getByRole('option', { name: 'Sales' }).click();

    // Position
    await comboboxes.nth(1).click();
    await page.getByRole('option', { name: 'Sales Development Representative' }).click();

    // Role
    await comboboxes.nth(2).click();
    await page.getByRole('option', { name: 'Employee' }).click();

    // Work Mode
    await comboboxes.nth(3).click();
    await page.getByRole('option', { name: 'Remote' }).click();

    // Work Location
    await comboboxes.nth(4).click();
    await page.getByRole('option').first().click();

    await page.getByRole('button', { name: /next/i }).click();

    // Personal Details
    await page.getByRole('button', { name: /next/i }).click();

    // Payment Information
    await page.getByPlaceholder('Enter account number').fill('1234567890');
    await page.getByPlaceholder('Enter accountName as per Bank').fill('Shalini Kumar');

    await page.getByPlaceholder('Enter bank name').first().fill('State Bank of India');
    await page.getByPlaceholder('Enter bank name').nth(1).fill('Madurai Branch');

    await page.getByPlaceholder('Enter IFSC code').fill('SBIN0001234');

    await page.getByRole('button', { name: /submit/i }).click();

    await page.waitForLoadState('networkidle');
  });

});