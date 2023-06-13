import { expect, Locator, Page } from '@playwright/test';

export class EncryptionPasswordPopup {
    readonly page: Page;
    readonly password: Locator;
    readonly passwordConfirmation: Locator;
    readonly acceptButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.password = page.getByRole('textbox', { name: 'User password', exact: true });
        this.passwordConfirmation = page.getByRole('textbox', { name: 'User password confirmation' });
        this.acceptButton = page.getByRole('button', { name: 'Accept' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async fillPassword(password: string) {
        await this.password.fill(password);
    }

    async fillPasswordConfirmation(password: string) {
        await this.passwordConfirmation.fill(password);
    }

    async accept() {
        await this.acceptButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}

