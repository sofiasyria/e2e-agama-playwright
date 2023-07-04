export class DefineUserPage {
    readonly page: Page;
    readonly userFullName: Locator;
    readonly password: Locator;
    readonly userFullName: Locator;
    readonly userName: Locator;
    readonly confirmPassword: Locator;
    readonly confirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userFullName = page.getByRole('textbox', { name: 'User fullname' });
        this.userName = page.getByRole('textbox', { name: 'Username' });
        this.password = page.getByRole('textbox', { name: 'User password', exact: true });
        this.confirmPassword = page.getByLabel('Password confirmation');
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
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
