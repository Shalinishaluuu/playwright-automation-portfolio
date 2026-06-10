const { test, expect } = require('@playwright/test');

const URL = 'https://devadminbwt.netlify.app';
const EMAIL = 'bharathipriya.works+21@blackwinstech.com';
const PASSWORD = 'pcclbu62';
const LOP_URL = `${URL}/admin/lop-calculator`;

async function login(page) {
  await page.goto(`${URL}/login`);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');
}

test.describe('LOP Calculator', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(LOP_URL);
    await page.waitForLoadState('networkidle');
  });

  // ── Page load ──────────────────────────────────────────────────────────────

  test('LOP Calculator page loads correctly', async ({ page }) => {
    await expect(page.getByText(/loss of pay/i).first()).toBeVisible();
    await expect(page.getByRole('combobox').nth(0)).toBeVisible(); // Month
    await expect(page.getByRole('combobox').nth(1)).toBeVisible(); // Year
    await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible();
  });

  // ── Calculate current month ────────────────────────────────────────────────

  test('Calculate shows results table for current month', async ({ page }) => {
    const month = new Date().toLocaleString('default', { month: 'long' }); // e.g. "June"
    const year  = new Date().getFullYear().toString();                      // e.g. "2026"

    // Select Month
    await page.getByRole('combobox').nth(0).click();
    await page.getByRole('option', { name: month }).click();

    // Select Year
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: year }).click();

    // Calculate
    await page.getByRole('button', { name: 'Calculate' }).click();

    // ✅ Results table appears
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });

    // ✅ Table headers are correct
    await expect(page.getByRole('columnheader', { name: 'Employee' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total Days' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Present' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Absent' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Leaves' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Permission (hrs)' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'LOP Days' })).toBeVisible();

    // ✅ At least one data row is present
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  // ── Download Report ────────────────────────────────────────────────────────

  test('Download Report button appears after Calculate and triggers download', async ({ page }) => {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year  = new Date().getFullYear().toString();

    await page.getByRole('combobox').nth(0).click();
    await page.getByRole('option', { name: month }).click();

    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: year }).click();

    await page.getByRole('button', { name: 'Calculate' }).click();

    // ✅ Download Report button appears
    const downloadBtn = page.getByRole('button', { name: /download report/i });
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });

    // ✅ Clicking it triggers a file download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv|pdf)$/i);
  });

  // ── Search employees ───────────────────────────────────────────────────────

  test('Search filters employee rows in results table', async ({ page }) => {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year  = new Date().getFullYear().toString();

    await page.getByRole('combobox').nth(0).click();
    await page.getByRole('option', { name: month }).click();

    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: year }).click();

    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });

    // Type in search box
    await page.getByPlaceholder(/search employees/i).fill('bharathi');
    await page.waitForTimeout(800);

    // ✅ Only matching rows shown
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText(/bharathi/i);
    }
  });

});