export class ConfigureRootPasswordPage {
    readonly page: Page;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly confirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.password = page.getByRole('textbox', { name: 'User password', exact: true });
        this.confirmPassword = page.getByLabel('Password confirmation');
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    }

    async fillAndConfirmPassword(password: string) {
        await this.password.fill(password);
        await this.confirmPassword.fill(password);
    }

    async confirm() {
        await this.confirmButton.click();
    }
}
