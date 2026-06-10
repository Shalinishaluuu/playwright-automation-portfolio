const { test, expect } = require('@playwright/test');

const URL = 'https://devadminbwt.netlify.app';
const EMAIL = 'bharathipriya.works+21@blackwinstech.com';
const PASSWORD = 'pcclbu62';

async function login(page) {
  await page.goto(`${URL}/login`);
  await page.locator('//input[@type="email"]').fill(EMAIL);
  await page.locator('//input[@type="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');  // 
}
// ── Cards ─────────────────────────────────────────────────────────────────────

test('show summary cards', async ({ page }) => {
  await login(page);
  await expect(page.getByText('Total Employees')).toBeVisible();
  await expect(page.getByText('Pending Leaves to Approve')).toBeVisible();
  await expect(page.getByText('Pending Permissions to Approve')).toBeVisible();
  await expect(page.getByText('On Leave Today')).toBeVisible();
});

// ── Tabs ──────────────────────────────────────────────────────────────────────

// test('switch to Permission Requests tab', async ({ page }) => {
//   //  Before — matches 2 elements
// await page.getByText('Permission Requests').click();
// // After — targets the tab exactly
// await page.getByRole('tab', { name: 'Permission Requests' }).click();
// await expect(page.getByRole('tab', { name: 'Permission Requests' })).toBeVisible();
// });

// ── Filter Dropdown ───────────────────────────────────────────────────────────

// test('filter dropdown has All, Pending, Approved, Rejected', async ({ page }) => {
//   await login(page);
//   await page.getByText('All').click();
//   await expect(page.getByText('Pending')).toBeVisible();
//   await expect(page.getByText('Approved')).toBeVisible();
//   await expect(page.getByText('Rejected')).toBeVisible();
// });

test('filter by Pending shows only pending rows', async ({ page }) => {
  await login(page);
  await page.getByText('All').click();
  await page.getByRole('option', { name: 'Pending' }).click();
  const rows = page.locator('tbody tr');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i).getByText('Pending')).toBeVisible();
  }
});

// test('filter by Approved shows only approved rows', async ({ page }) => {
//   await login(page);
//   await page.getByText('All').click();
//   await page.getByRole('option', { name: 'Approved' }).click();
//   const rows = page.locator('tbody tr');
//   const count = await rows.count();
//   for (let i = 0; i < count; i++) {
//     await expect(rows.nth(i).getByText('Approved')).toBeVisible();
//   }
// });

// ── Search ────────────────────────────────────────────────────────────────────

test('search by employee name filters rows', async ({ page }) => {
  await login(page);
  await page.fill('[placeholder="Search Name..."]', 'bharathi');
  await expect(page.locator('tbody tr').first()).toBeVisible();
});

// ── Table Actions ─────────────────────────────────────────────────────────────

// test('pending row shows Approve and Reject buttons', async ({ page }) => {
//   await login(page);
//   const row = page.locator('tbody tr').filter({ hasText: 'Pending' }).first();
//   await expect(row.getByRole('button', { name: 'Approve' })).toBeVisible();
//   await expect(row.getByRole('button', { name: 'Reject' })).toBeVisible();
// });




// test('approve a pending request', async ({ page }) => {
//   await login(page);
//   const row = page.locator('tbody tr').filter({ hasText: 'Pending' }).first();
//   const reason = await row.locator('td').nth(3).innerText(); // grab unique identifier
//   await row.getByRole('button', { name: 'Approve' }).click();
//   await expect(
//     page.locator('tbody tr').filter({ hasText: reason }).locator('td').nth(4)
//   ).toHaveText('Approved');
// });

// test('reject a pending request', async ({ page }) => {
//   await login(page);
//   const row = page.locator('tbody tr').filter({ hasText: 'Pending' }).last(); // use last to avoid conflict
//   const reason = await row.locator('td').nth(3).innerText();
//   await row.getByRole('button', { name: 'Reject' }).click();
//   await expect(
//     page.locator('tbody tr').filter({ hasText: reason }).locator('td').nth(4)
//   ).toHaveText('Rejected');
// });

// ── Download ──────────────────────────────────────────────────────────────────

test('download report button triggers file download', async ({ page }) => {
  await login(page);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download Report' }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.(csv|pdf|xlsx)$/i);
});