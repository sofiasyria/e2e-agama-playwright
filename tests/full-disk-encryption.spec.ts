import { test, expect } from '@playwright/test';
import { IndexActor } from '../actors/index-actor';
import { StoragePage } from '../pages/storage-page';
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { EncryptionPasswordPopup } from '../pages/encryption-password-popup';
import { UsersActor } from '../actors/users-actor';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        const productSelectionOpensusePage = new ProductSelectionOpensusePage(page);
        const mainPage = new MainPage(page);
        const indexActor = new IndexActor(page, mainPage, productSelectionOpensusePage);
        indexActor.goto();
        indexActor.handleProductSelectionIfAny();
	const usersActor = new UsersActor(page, mainPage);
	usersActor.createUserAndDefineRootPassword();
    });

      test('Full-disk encryption', async ({ page }) => {
        const mainPage = new MainPage(page);
        await test.step("Set for Full-disk encryption", async () => {
            await mainPage.accessStorage();

            const storagePage = new StoragePage(page);
            await storagePage.useEncryption();

            const passwordPopup = new EncryptionPasswordPopup(page);
            await passwordPopup.fillPassword('nots3cr3t');
            await passwordPopup.fillPasswordConfirmation('nots3cr3t');
            await passwordPopup.accept();

            await storagePage.validateEncryptionIsUsed();
            await storagePage.back();

	    await usersActor.createUserAndDefineRootPassword();
        });

        //Installation
        await test.step("Run installation", async () => {
            test.setTimeout(30 * minute);
            // start the installation
            await expect(page.getByText("Installation will take")).toBeVisible({ timeout: 2 * minute });
            await mainPage.install();
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
