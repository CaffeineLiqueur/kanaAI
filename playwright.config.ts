import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT || 3000)
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: { baseURL, trace: 'on-first-retry' },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI && !process.env.E2E_DATABASE_URL,
    env: process.env.E2E_DATABASE_URL ? { DATABASE_URL: process.env.E2E_DATABASE_URL } : undefined,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.platform === 'win32' ? 'chrome' : undefined, viewport: { width: 1440, height: 900 } } },
    { name: 'compact', use: { ...devices['Desktop Chrome'], channel: process.platform === 'win32' ? 'chrome' : undefined, viewport: { width: 1024, height: 768 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], channel: process.platform === 'win32' ? 'chrome' : undefined, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
})
