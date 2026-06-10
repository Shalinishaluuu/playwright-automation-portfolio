const { test, expect } = require('@playwright/test');

const URL = 'https://devadminbwt.netlify.app';
const CANDIDATES_URL = `${URL}/admin/candidates`;
const EMAIL = 'bharathipriya.works+21@blackwinstech.com';
const PASSWORD = 'pcclbu62';

async function login(page) {
  await page.goto(`${URL}/login`);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle');
}

/**
 * Helper: open the "All Sources" / source-filter dropdown.
 *
 * The trigger is rendered as a button/div whose visible text starts with
 * "All Sources" (or the currently selected source name). We use a broad
 * role-based locator so it works regardless of the underlying component
 * library (shadcn Select, Radix, plain <select>, etc.).
 */
async function openSourceDropdown(page) {
  // Try a <button> or role="combobox" whose label contains "Sources" or "Source"
  const trigger = page
    .locator('button, [role="combobox"], [role="listbox"]')
    .filter({ hasText: /sources|source/i })
    .first();

  // Fallback: any clickable element containing the text "All Sources"
  const fallback = page.locator('text=All Sources').first();

  if (await trigger.isVisible()) {
    await trigger.click();
  } else {
    await fallback.click();
  }

  // Wait for the dropdown options to appear
  await page.waitForTimeout(500);
}

test.describe('Candidates Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(CANDIDATES_URL);
    await page.waitForLoadState('networkidle');
  });

  // ─── Static UI checks ────────────────────────────────────────────────────────

  test('page title and subtitle are visible', async ({ page }) => {
    await expect(
      page.locator('h1, h2').filter({ hasText: 'Candidates' }).first()
    ).toBeVisible();
    await expect(page.locator('text=Manage all your candidates')).toBeVisible();
  });

  test('Manually Added card is visible', async ({ page }) => {
    await expect(page.locator('text=Manually Added')).toBeVisible();
  });

  test('Email-Sourced card is visible', async ({ page }) => {
    await expect(page.locator('text=Email-Sourced')).toBeVisible();
  });

  test('Upload Resume button is visible and enabled', async ({ page }) => {
    const btn = page.locator('button', { hasText: /upload resume/i });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  // ─── Search tests ─────────────────────────────────────────────────────────────
  // FIX: use a partial placeholder match so minor punctuation differences
  //      ("Search Candidate.." vs "Search Candidate...") don't break the test.

  test('Search candidate by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search candidate/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Steeve');
    // Wait for debounce / API round-trip
    await page.waitForTimeout(1500);

    // At least one row mentioning "Steeve" must be visible
    const matchingRows = page.locator('table tbody tr').filter({ hasText: 'Steeve' });
    await expect(matchingRows.first()).toBeVisible();
  });

 test('Search with invalid name shows No results', async ({ page }) => {
  const searchInput = page.getByPlaceholder(/search candidate/i);

  await expect(searchInput).toBeVisible();

  await searchInput.fill('nmdcbdsmn');

  await expect(
    page.getByText(/No results/i)
  ).toBeVisible({ timeout: 10000 });

  });

  // 

  test('Filter by source - Manual', async ({ page }) => {
    await openSourceDropdown(page);

    // Click the "Manual" option inside the open dropdown
    await page.locator('[role="option"], li, [data-value]')
      .filter({ hasText: /^Manual$/i })
      .first()
      .click();

    await page.waitForTimeout(1000);

    const sourceCells = page.locator('table tbody tr td:nth-child(4)');
    const count = await sourceCells.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(sourceCells.nth(i)).toHaveText('Manual');
    }
  });

  test('Filter by source - Website', async ({ page }) => {
    await openSourceDropdown(page);

    await page.locator('[role="option"], li, [data-value]')
      .filter({ hasText: /^Website$/i })
      .first()
      .click();

    await page.waitForTimeout(1000);

    const sourceCells = page.locator('table tbody tr td:nth-child(4)');
    const count = await sourceCells.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(sourceCells.nth(i)).toHaveText('Website');
    }
  });

  test('Manual tab search, filter by percentage and clear all', async ({ page }) => {

  // Open Manual tab
  await page.getByRole('tab', { name: /manual/i }).click();

  // Search candidate
  const searchInput = page.getByPlaceholder(/search candidate/i);
  await searchInput.fill('Surya');

  // Wait for search results
  await page.waitForTimeout(2000);

  // Open Filter dropdown
  await page.getByRole('button', { name: /filter/i }).click();

  // Select percentage
  await page.getByText('20%').click();

  // Wait for filtered results
  await page.waitForTimeout(2000);

  // Verify rows exist after filtering
  const rows = page.locator('table tbody tr');
  await expect(rows.first()).toBeVisible();

  // Click Clear All
  await page.getByRole('button', { name: /clear all/i }).click();

  // Verify search box is cleared
  await expect(searchInput).toHaveValue('');

  // Verify filter popup is closed
  await expect(page.getByText('20%')).not.toBeVisible();

});
test('Gmail tab - Filter by all percentages and Clear All', async ({ page }) => {

  await page.getByRole('tab', { name: /gmail/i }).click();

  const percentages = ['20%', '50%', '80%'];

  for (const percentage of percentages) {

    await page.getByRole('button', { name: /filter/i }).click();

    const popup = page.locator('[role="dialog"]').last();

    await popup.getByText(percentage, { exact: true }).click();

    await expect(
      page.locator('table tbody tr').first()
    ).toBeVisible();

    await page.getByRole('button', { name: /clear all/i }).click();
  }
});
  test('Upload resume with AI/ML Engineer role and post', async ({ page }) => {
    // Click Upload Resume button
    await page.getByRole('button', { name: /upload resume/i }).click();
    await expect(page).toHaveURL(/\/admin\/upload/);
 
    // Open role dropdown and select AI/ML Engineer
    await page.locator('text=Select a Role').click();
    await page.getByText('AI/ML Engineer', { exact: true }).click();
 
    // Verify selected role is shown
    await expect(page.locator('text=AI/ML Engineer')).toBeVisible();
 
    // Upload a PDF file
    await page.locator('input[type="file"]').setInputFiles(
      'C:\\Users\\shali\\Pictures\\Screenshots\\Downloads\\AI_ML_Engineer_Resume.pdf'
    );
 
    // Wait for file to appear in the list
    await expect(page.getByText('AI_ML_Engineer_Resume.pdf')).toBeVisible();
 
    // Wait for upload progress bar to complete
    await page.waitForTimeout(3000);
 
    // Click Post button
    await page.getByRole('button', { name: /post/i }).click();
 
    // Wait for post to complete
    await page.waitForLoadState('networkidle');
  });
 
  test('Upload page shows correct file type hint', async ({ page }) => {
    await page.goto(`${URL}/admin/upload`);
    await expect(page.locator('text=Only supports .pdf,.zip file types')).toBeVisible();
  });
 
  test('Upload page shows max file limit hint', async ({ page }) => {
    await page.goto(`${URL}/admin/upload`);
    await expect(page.locator('text=upload up to 5 files max')).toBeVisible();
  });
 
});
 
 



