import { test, expect } from '@playwright/test';
import { mainPagePath } from "../lib/installer";

test.describe('The main page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(mainPagePath());
  });

  test('has the "Agama" SUPER SUPER title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Agama/);
  });
})
