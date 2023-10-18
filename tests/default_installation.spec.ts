import { test, expect } from '@playwright/test';
import { IndexActor } from "../actors/index-actor";
import { UserActor } from "../actors/user-actor";
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { InstallActor } from '../actors/install-actor';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        const productSelectionOpensusePage = new ProductSelectionOpensusePage(page);
        const mainPage = new MainPage(page);
        const indexActor = new IndexActor(page, mainPage, productSelectionOpensusePage);
        indexActor.goto();
        indexActor.handleProductSelectionIfAny();
    });

    test('Default installation test', async ({ page }) => {
        const mainPage = new MainPage(page);
        await test.step("set mandatory user and root password", async () => {
            await mainPage.accessUsers();
            await (new UserActor(page)).handleUser();
        });

        //Installation
        await test.step("Run installation", async () => {
            test.setTimeout(30 * minute);
            const installActor = new InstallActor(page, mainPage);
            await installActor.handleInstallation();
        })
    });
});
