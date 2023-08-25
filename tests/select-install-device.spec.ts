import { test, expect } from '@playwright/test';
import { IndexActor } from "../actors/index-actor";
import { StoragePage } from '../pages/storage-page';
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { UsersPage } from '../pages/users-page';
import { DefineUserPage } from '../pages/define-user-page';
import { ConfigureRootPasswordPage } from '../pages/configure-root-password-page';
import { InstallationDevicePage } from '../pages/install-device-page';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        const productSelectionOpensusePage = new ProductSelectionOpensusePage(page);
        const mainPage = new MainPage(page);
        const indexActor = new IndexActor(page, mainPage, productSelectionOpensusePage);
        indexActor.goto();
        indexActor.handleProductSelectionIfAny();
    });

      test('Installation on second available storage device', async ({ page }) => {
        const mainPage = new MainPage(page);
        await test.step("select second available device for installation", async () => {
            const storagePage = new StoragePage(page);
            const installationDevice = new InstallationDevicePage(page);

            await mainPage.accessStorage();
            await storagePage.accessInstallationDevice();
            await installationDevice.change();
            await installationDevice.accept();
            await storagePage.back();
        });

        await test.step("Define user and set root password", async () => {
            const usersPage = new UsersPage(page);
            const defineUserPage = new DefineUserPage(page);
            const configureRootPasswordPage = new ConfigureRootPasswordPage(page);

            await mainPage.accessUsers();
            await usersPage.expectNoUserDefined();
            await usersPage.defineUser();          
            await defineUserPage.fillUserFullName('Bernhard M. Wiedemann');
            await defineUserPage.fillUserName('bernhard');
            await defineUserPage.fillAndConfirmPassword('nots3cr3t');
            await defineUserPage.confirm();
            await usersPage.expectRootPasswordNotSet();

            await usersPage.configureRootPassword();
            await configureRootPasswordPage.fillAndConfirmPassword('nots3cr3t');
            await configureRootPasswordPage.confirm();
            await usersPage.back();
        })

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
      });
    });
});
