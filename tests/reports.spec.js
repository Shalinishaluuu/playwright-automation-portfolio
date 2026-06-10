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

test.describe('Reports Page', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${URL}/admin/reports`);
    await page.waitForLoadState('networkidle');
  });

  // ── Page load ──────────────────────────────────────────────────────────────

  test('Reports page loads with all three sections', async ({ page }) => {
    await expect(page.getByText(/employee report/i).first()).toBeVisible();
    await expect(page.getByText(/candidate report/i)).toBeVisible();
    await expect(page.getByText(/employee attendance/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /download report/i })).toHaveCount(3);
  });

  // ── Individual report downloads ────────────────────────────────────────────

  test('Employee Report - Download triggers file', async ({ page }) => {
    const month = new Date().toLocaleString('en-US', { month: 'long' });
    const year  = new Date().getFullYear().toString();

    await page.getByRole('combobox').filter({ hasText: 'Select Month' }).nth(0).click();
    await page.getByRole('option', { name: month }).click();

    await page.getByRole('combobox').filter({ hasText: 'Select Year' }).nth(0).click();
    await page.getByRole('option', { name: year }).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /download report/i }).nth(0).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv|pdf)$/i);
  });
test('Candidate Report - shows toast when no candidates found', async ({ page }) => {
  // Select a month/year combination unlikely to have candidates
  await page.getByRole('combobox').filter({ hasText: 'Select Month' }).nth(1).click();
  await page.getByRole('option', { name: 'June' }).click();

  await page.getByRole('combobox').filter({ hasText: 'Select Year' }).nth(1).click();
  await page.getByRole('option', { name: '2025' }).click();

  await page.getByRole('combobox').filter({ hasText: 'Select Status' }).click();
  await page.getByRole('option', { name: 'Shortlisted' }).click();

  await page.getByRole('combobox').filter({ hasText: 'Select Type' }).click();
  await page.getByRole('option', { name: 'All Candidates' }).click();

  // Click download — no file expected, toast should appear instead
  await page.getByRole('button', { name: /download report/i }).nth(1).click();

  //  Assert toast message is visible
  await expect(
    page.getByText('No candidates found for the given filters')
  ).toBeVisible({ timeout: 5000 });
});
  test('Employee Attendance - Download triggers file', async ({ page }) => {
    const month = new Date().toLocaleString('en-US', { month: 'long' });
    const year  = new Date().getFullYear().toString();

    await page.getByRole('combobox').filter({ hasText: 'Select Month' }).nth(2).click();
    await page.getByRole('option', { name: month }).click();

    await page.getByRole('combobox').filter({ hasText: 'Select Year' }).nth(2).click();
    await page.getByRole('option', { name: year }).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /download report/i }).nth(2).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv|pdf)$/i);
  });

});