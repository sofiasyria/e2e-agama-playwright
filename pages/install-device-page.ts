import { expect, type Locator, type Page } from '@playwright/test';

export class InstallationDevicePage {
    readonly page: Page;
    readonly secondDevice: Locator;
    readonly acceptButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.secondDevice = page.getByRole('listbox').locator('li').nth(1);
        this.acceptButton = page.getByRole('button', { name: 'Accept' });
    }

    async change() {
        await expect(this.secondDevice).toBeVisible();
        await this.secondDevice.click();
    }

    async accept() {
        await this.acceptButton.click();
    }
}
