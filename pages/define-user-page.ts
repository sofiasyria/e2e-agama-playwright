import { type Locator, type Page } from '@playwright/test';

export class DefineUserPage {
    readonly page: Page;
    readonly confirmButton: Locator;
    readonly confirmPassword: Locator;
    readonly password: Locator;
    readonly userFullName: Locator;
    readonly userName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        this.confirmPassword = page.locator('#passwordConfirmation')
        this.password = page.locator('#password')
        this.userFullName = page.locator('#userFullName');
        this.userName = page.locator('#userName');
    }

    async fillUserFullName(fullname: string) {
        await this.userFullName.fill(fullname);
    }

    async fillUserName(username: string) {
        await this.userName.fill(username);
    }

    async fillAndConfirmPassword(password: string) {
        await this.password.fill(password);
        await this.confirmPassword.fill(password);
    }

    async confirm() {
        await this.confirmButton.click();
    }
}
