import { test, expect } from '@playwright/test';
import { AddFileSystemPage } from '../pages/add-file-system-page';
import { IndexActor } from "../actors/index-actor";
import { UserActor } from "../actors/user-actor";
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { StoragePage } from '../pages/storage-page';
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

    test('Add /home file system', async ({ page }) => {
        const mainPage = new MainPage(page);
        await test.step("Start to add home file system", async () => {
            await mainPage.accessStorage();

            const storagePage = new StoragePage(page);
            await storagePage.accessAddFileSystem();
            const addFileSystemPage = new AddFileSystemPage(page);
            await addFileSystemPage.accept();
            await storagePage.back();

        });

        await test.step("set mandatory user and root password", async () => {
            await mainPage.accessUsers();
            await (new UserActor(page)).handleUser();
        });

        await test.step("Run installation", async () => {
            test.setTimeout(30 * minute);
            const installActor = new InstallActor(page, mainPage);
            await installActor.handleInstallation();
        })
    });
});
