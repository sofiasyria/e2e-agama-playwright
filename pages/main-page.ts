import { expect, type Locator, type Page } from '@playwright/test';

export class MainPage {
    readonly page: Page;
    readonly accessStorageLink: Locator;
    readonly accessUsersLink: Locator;
    readonly installButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accessStorageLink = page.getByRole('link', { name: 'Storage' });
        this.accessUsersLink = page.getByRole('link', { name: 'Users' });
        this.installButton = page.getByRole("button", { name: "Install", exact: true });
    }

    async accessStorage() {
        await this.accessStorageLink.click();
    }

    async accessUsers() {
        await this.accessUsersLink.click();
    }

    async install() {
        await this.installButton.click();
    }

}
