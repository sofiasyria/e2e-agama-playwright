import { test, expect } from '@playwright/test';
import { IndexActor } from "../actors/index-actor";
import { UserActor } from "../actors/user-actor";
import { StoragePage } from '../pages/storage-page';
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
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

        await test.step("set mandatory user and root password", async () => {
            await mainPage.accessUsers();
            await (new UserActor(page)).handleUser();
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
      });
    });
});
