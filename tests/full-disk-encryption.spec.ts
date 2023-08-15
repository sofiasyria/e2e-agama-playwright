import { test, expect } from '@playwright/test';
import { StoragePage } from './pages/storage-page';
import { MainPage } from '../pages/main-page';
import { EncryptionPasswordPopup, encryptionPasswordPopup } from './pages/encryption-password-popup';
import { mainPagePath } from "../lib/installer";
import { UsersPage } from '../pages/users-page';
import { DefineUserPage } from '../pages/define-user-page';
import { ConfigureRootPasswordPage } from '../pages/configure-root-password-page';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(mainPagePath());
    });

    test('Full-disk encryption', async ({ page }) => {

        const mainPage = new MainPage(page);
        await mainPage.set_storage();

        const storagePage = new StoragePage(page);
        await storagePage.useEncryption();

        const passwordPopup = new EncryptionPasswordPopup(page);
        await passwordPopup.fillPassword('nots3cr3t');
        await passwordPopup.fillPasswordConfirmation('nots3cr3t');
        await passwordPopup.accept();

        await storagePage.validateEncryptionIsUsed();
        await storagePage.back();

        await expect(page.getByText(process.env.PRODUCTNAME)).toBeVisible({ timeout: 2 * minute });
        await mainPage.set_users();

        const usersPage = new UsersPage(page);
        await usersPage.expectNoUserDefined();
        await usersPage.defineUser();
        const defineUserPage = new DefineUserPage(page);
        await defineUserPage.fillUserFullName('Bernhard M. Wiedemann');
        await defineUserPage.fillUserName('bernhard');
        await defineUserPage.fillAndConfirmPassword('nots3cr3t');
        await defineUserPage.confirm();
        await usersPage.expectRootPasswordNotSet();
        await usersPage.configureRootPassword();
        const configureRootPasswordPage = new ConfigureRootPasswordPage(page);
        await configureRootPasswordPage.fillAndConfirmPassword('nots3cr3t');
        await configureRootPasswordPage.confirm();
        await usersPage.back();

        //Installation
        await test.step("Run installation", async () => {
            test.setTimeout(30 * minute);
            // start the installation
            await expect(page.getByText(process.env.PRODUCTNAME)).toBeVisible({ timeout: 2 * minute });
            await expect(page.getByText("Installation will take")).toBeVisible({ timeout: 2 * minute });
            await mainPage.install();
            await expect(page.getByText("Confirm Installation")).toBeVisible({ timeout: 2 * minute });
            await mainPage.continue();
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
        });
    });
