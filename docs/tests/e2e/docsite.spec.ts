import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

test.describe('phenotypeActions docs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('homepage loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })

  test('route /zh-CN /zh-TW /fa /fa-Latn loads', async ({ page }) => {
    await page.goto(BASE_URL + '/zh-CN /zh-TW /fa /fa-Latn')
    await expect(page.locator('body')).toBeVisible()
  })
})
