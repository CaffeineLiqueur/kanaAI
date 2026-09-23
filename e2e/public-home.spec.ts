import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import path from 'node:path'

test('公开首页可用且没有明显无障碍问题', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /每天 15 分钟/ })).toBeVisible()
  await expect(page.locator('.btn-primary').first()).toHaveCSS('background-color', 'rgb(200, 75, 66)')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.failureSummary) }))).toEqual([])
  await page.screenshot({ path: path.join(test.info().outputDir, 'home.png'), fullPage: true })
})
