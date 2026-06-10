// const { defineConfig } = require('@playwright/test');
 
// module.exports = defineConfig({
//   testDir: './tests',
//   timeout: 30_000,
//   retries: 1,
 
//   reporter: [
//     ['list'],                                   // console output
//     ['html', { outputFolder: 'report', open: 'never' }],  // HTML report
//     ['json', { outputFile: 'report/results.json' }]       // JSON for CI
//   ],
 
//   use: {
//     baseURL: 'https://books.toscrape.com',
//     headless: true,
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//   },
 
//   projects: [
//     { name: 'chromium', use: { browserName: 'chromium' } },
//   ],
// });
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  retries: 1,

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'always'
    }],
    ['json', {
      outputFile: 'test-results/results.json'
    }],
    ['junit', {
      outputFile: 'test-results/results.xml'
    }]
  ],

  use: {
    headless: true,

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium'
      }
    }
  ]
});
 