import { test, expect } from '@playwright/test';
import { AddFileSystemPage } from '../pages/add-file-system-page';
import { IndexActor } from "../actors/index-actor";
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { StoragePage } from '../pages/storage-page';
import { UsersPage } from '../pages/users-page';
import { DefineUserPage } from '../pages/define-user-page';
import { ConfigureRootPasswordPage } from '../pages/configure-root-password-page';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        const productSelectionOpensusePage = new ProductSelectionOpensusePage(page);
        const mainPage = new MainPage(page);
        const indexActor = new IndexActor(page, mainPage, productSelectionOpensusePage);
        indexActor.goto();
        indexActor.handleProductSelectionIfAny();
    });

    test('Add /home file system', async ({ page }) => {
        const mainPage = new MainPage(page);
        await mainPage.accessStorage();
        
        const storagePage = new StoragePage(page);
        await storagePage.accessAddFileSystem();
        const addFileSystemPage = new AddFileSystemPage(page);
        await addFileSystemPage.accept();
        await storagePage.back();
      
        await mainPage.accessUsers();
      
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
    
        await test.step("Run installation", async () => {
            test.setTimeout(30 * minute);
            // start the installation
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
        });
    });
});
