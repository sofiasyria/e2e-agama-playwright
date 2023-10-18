import { expect, type Page } from '@playwright/test';
import { MainPage } from '../pages/main-page';
import { ConfirmInstallationPage } from '../pages/confirm-installation-page';
import { InstallingPage } from '../pages/installing-page';
import { InstallationFinishedPage } from '../pages/installation-finished-page';

export class InstallActor {
    readonly page: Page;
    readonly mainPage: MainPage;
    readonly confirmInstallationPage: ConfirmInstallationPage;
    readonly installationProgressPage: InstallingPage;
    readonly installationFinishedPage: InstallationFinishedPage;

    constructor(page: Page,
        mainPage: MainPage) {
        this.page = page;
        this.mainPage = mainPage;
    }

    async handleInstallation() {
        await expect(this.page.getByText("Installation will take")).toBeVisible({ timeout: 2 * 60 * 1000 });
        await this.mainPage.install();
        const confirmInstallationPage = new ConfirmInstallationPage(this.page);
        const installationProgressPage = new InstallingPage(this.page);
        const installationFinishedPage = new InstallationFinishedPage(this.page);
        await confirmInstallationPage.confirm();
        await installationProgressPage.expectProgress();
        await installationFinishedPage.expectCongratulations();
    }
}
