import { test, expect } from '@playwright/test';
import { StoragePage } from './pages/storage-page';
import { EncryptionPasswordPopup, encryptionPasswordPopup } from './pages/encryption-password-popup';
import { mainPagePath } from "../lib/installer";

const minute = 60 * 1000;
test.describe('The main page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(mainPagePath());
  });

  test('Full-disk encryption', async ({ page }) => {
    await test.step("Select the product", async () => {
      await page.getByLabel('SUSE ALP Server').check();
      await page.getByRole("button", { name: "Select" }).click();
    });

    await page.getByRole('link', { name: 'Storage' }).click();

    const storagePage = new StoragePage(page);
    await storagePage.useEncryption();

    const passwordPopup = new EncryptionPasswordPopup(page);
    await passwordPopup.fillPassword('nots3cr3t');
    await passwordPopup.fillPasswordConfirmation('nots3cr3t');
    await passwordPopup.accept();

    await storagePage.validateEncryptionIsUsed();
    await storagePage.back();

    await expect(page.getByText("SUSE ALP Server")).toBeVisible({ timeout: 2 * minute });
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page.getByText("Users")).toBeVisible({ timeout: 1 * minute });
    await page.getByRole('button', { name: 'Define a user now' }).click();
    await page.getByRole('textbox', { name: 'User fullname' }).click();
    await page.getByRole('textbox', { name: 'User fullname' }).fill('bernhard');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('bernhard');
    await page.getByRole('textbox', { name: 'User password', exact: true }).click();
    await page.getByRole('textbox', { name: 'User password', exact: true }).fill('nots3cr3t');
    await page.getByLabel('Password confirmation').click();
    await page.getByLabel('Password confirmation').fill('nots3cr3t');
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    //Users page: set root password 
    await page.getByRole('button', { name: 'Set a password' }).click();
    await page.getByRole('textbox', { name: 'User password', exact: true }).fill('nots3cr3t');
    await page.getByLabel('Password confirmation').click();
    await page.getByLabel('Password confirmation').fill('nots3cr3t');
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await page.getByRole('button', { name: 'Back' }).click();
    //Installation
    await test.step("Run installation", async () => {
      test.setTimeout(30 * minute);
      // start the installation
      await expect(page.getByText("SUSE ALP Server")).toBeVisible({ timeout: 2 * minute });
      await expect(page.getByText("Installation will take")).toBeVisible({ timeout: 2 * minute });
      await page.getByRole("button", { name: "Install", exact: true }).click();
      await expect(page.getByText("Confirm Installation")).toBeVisible({ timeout: 2 * minute });
      await page.getByRole("button", { name: "Continue" }).click();
      // wait for the package installation progress
      await expect(page.getByText("Installing packages")).toBeVisible({ timeout: 8 * minute });
      while (true) {
        try {
          await page.getByRole("heading", { name: "Congratulations!" }).waitFor({ timeout: minute / 2 });
          break;
        }
        catch (error) {
          // do not ignore other errors
          if (error.constructor.name !== "TimeoutError") throw (error);
        }
      }
    })
  })
})
