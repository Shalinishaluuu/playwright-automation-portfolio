// ============================================================
//  Smoke Tests — books.toscrape.com  (free demo site)
//  Run: npx playwright test
// ============================================================

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://books.toscrape.com';

// ── 1. Homepage loads ────────────────────────────────────────
test('homepage loads successfully', async ({ page }) => {
  await page.goto(BASE_URL);

  // Page title should contain "Books"
  await expect(page).toHaveTitle(/Books to Scrape/i);

  // Main heading visible
  await expect(page.locator('h1')).toBeVisible();

  console.log('Homepage loaded');
});

// ── 2. Navigation links are present ──────────────────────────
test('navigation sidebar is visible', async ({ page }) => {
  await page.goto(BASE_URL);

  // Category sidebar exists
  const sidebar = page.locator('.side_categories');
  await expect(sidebar).toBeVisible();

  // "Books" category link present
  await expect(page.locator('.side_categories a').first()).toBeVisible();

  console.log('Navigation sidebar is present');
});

// ── 3. Books are listed on homepage ──────────────────────────
test('books are displayed on homepage', async ({ page }) => {
  await page.goto(BASE_URL);

  // At least 1 book article card visible
  const books = page.locator('article.product_pod');
  await expect(books.first()).toBeVisible();

  const count = await books.count();
  expect(count).toBeGreaterThan(0);

  console.log(`Found ${count} books on homepage`);
});

// ── 4. Book detail page opens ─────────────────────────────────
test('clicking a book opens its detail page', async ({ page }) => {
  await page.goto(BASE_URL);

  // Click the first book title link
  const firstBook = page.locator('article.product_pod h3 a').first();
  const bookTitle = await firstBook.getAttribute('title');
  await firstBook.click();

  // Should land on a product page
  await expect(page.locator('.product_main h1')).toBeVisible();

  // Price should be visible
  await expect(page.locator('.price_color')).toBeVisible();

  console.log(`Detail page opened for: "${bookTitle}"`);
});

// ── 5. Category filter works ──────────────────────────────────
test('filtering by category shows relevant books', async ({ page }) => {
  await page.goto(BASE_URL);

  // Click "Mystery" category
  await page.locator('.side_categories a', { hasText: 'Mystery' }).click();

  // URL should change to mystery category
  await expect(page).toHaveURL(/mystery/i);

  // Books should still be listed
  const books = page.locator('article.product_pod');
  await expect(books.first()).toBeVisible();

  console.log('Category filter works correctly');
});

// ── 6. Search / next page navigation ─────────────────────────
test('next page navigation works', async ({ page }) => {
  await page.goto(BASE_URL);

  // Click "next" button
  const nextBtn = page.locator('li.next a');
  await expect(nextBtn).toBeVisible();
  await nextBtn.click();

  // Should now be on page 2
  await expect(page).toHaveURL(/page-2/);

  // Books still visible on page 2
  await expect(page.locator('article.product_pod').first()).toBeVisible();

  console.log(' Pagination works — navigated to page 2');
});

// ── 7. 404 page for invalid URL ───────────────────────────────
test('invalid URL shows error or redirects gracefully', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/catalogue/this-book-does-not-exist_999/index.html`);

  // Either a 404 status or a visible error message
  const is404 = response?.status() === 404;
  const hasErrorText = await page.locator('body').innerText()
    .then(t => t.includes('404') || t.includes('not found') || t.includes('Sorry'));

  expect(is404 || hasErrorText).toBeTruthy();

  console.log('404 / error page handled gracefully');
});