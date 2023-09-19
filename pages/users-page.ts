import { expect, type Locator, type Page } from '@playwright/test';

export class UsersPage {
    readonly page: Page;
    readonly configureRootPasswordButton: Locator;
    readonly defineUserButton: Locator;
    readonly setRootPasswordDots: Locator;
    readonly setRootPasswordMenuItem: Locator;
    readonly backButton: Locator;
    readonly noUserDefinedText: Locator;
    readonly rootPasswordNotSetText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.noUserDefinedText = page.getByText('No user defined yet');
        this.defineUserButton = page.getByRole('button', { name: 'Define a user now' });
        this.rootPasswordNotSetText = page.getByText('No root authentication method defined yet');
        this.configureRootPasswordButton = page.getByRole('button', { name: 'Set a password' });
        this.backButton = page.getByRole('button', { name: 'Back' });
    }

    async expectNoUserDefined() {
        await expect(this.noUserDefinedText).toBeVisible(true);
    }

    async defineUser() {
        await this.defineUserButton.click();
    }

    async expectRootPasswordNotSet() {
        await expect(this.rootPasswordNotSetText).toBeVisible(true);
    }

    async configureRootPassword() {
        await this.configureRootPasswordButton.click();
    }

    async back() {
        await this.backButton.click();
    }
}
