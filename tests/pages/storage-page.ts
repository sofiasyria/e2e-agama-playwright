import { expect, Locator, Page } from '@playwright/test';

export class StoragePage {
    readonly page: Page;
    readonly useEncryptionToggle: Locator;
    readonly encryptionEnabled: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.useEncryptionToggle = page.getByRole('checkbox', { name: 'Use encryption' });
        this.encryptionEnabled = page.getByRole('button', { name: 'Encryption settings' });
        this.backButton = page.getByRole('button', { name: 'Back' });
    }

    async useEncryption() {
        await this.useEncryptionToggle.check();
    }


    async back() {
        await this.backButton.click();
    }

    async validateEncryptionIsUsed() {
        expect(await this.useEncryptionToggle.isChecked()).toBeTruthy();
    }
}
