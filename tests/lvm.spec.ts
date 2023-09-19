import { test, expect } from '@playwright/test';
import { IndexActor } from "../actors/index-actor";
import { UserActor } from "../actors/user-actor";
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { MainPage } from '../pages/main-page';
import { StoragePage } from '../pages/storage-page';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        const productSelectionPage = new ProductSelectionOpensusePage(page);
        const mainPage = new MainPage(page);
        const indexActor = new IndexActor(page, mainPage, productSelectionPage);
        indexActor.goto();
        indexActor.handleProductSelectionIfAny();
    });

      test("Use logical volume management (LVM) as storage device for installation", async ({ page }) => {
        const mainPage = new MainPage(page);
        await test.step("Set LVM and Users", async () => {
            await mainPage.accessStorage();

            const storagePage = new StoragePage(page);
            await storagePage.useLVM();
            await storagePage.back();

        });

        await test.step("set mandatory user and root password", async () => {
            await mainPage.accessUsers();
            await (new UserActor(page)).handleUser();
        });

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
