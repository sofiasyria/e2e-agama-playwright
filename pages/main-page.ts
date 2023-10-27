import { expect, type Locator, type Page } from '@playwright/test';

export class MainPage {
    readonly page: Page;
    readonly accessStorageLink: Locator;
    readonly accessUsersLink: Locator;
    readonly installButton: Locator;
    readonly installationSize: Locator;
    readonly noUserDefined: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accessStorageLink = page.getByRole('link', { name: 'Storage' });
        this.accessUsersLink = page.getByRole('link', { name: 'Users' });
        this.installButton = page.getByRole("button", { name: "Install", exact: true });
        this.installationSize = page.getByText("Installation will take");
        this.noUserDefined = page.getByText('No user defined yet');
    }

    async accessStorage() {
        await this.accessStorageLink.click();
    }

    async accessUsers() {
        await this.accessUsersLink.click();
    }

    async expectInstallationSize() {
        await expect(this.installationSize).toBeVisible({ timeout: 2 * 60 * 1000 });
    }

    async install() {
        await this.installButton.click();
    }

}
