export class MainPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
    this.setStorage = page.getByRole('link', { name: 'Storage' });
    this.setUsers = page.getByRole('link', { name: 'Users' });
    this.installButton = page.getByRole("button", { name: "Install", exact: true });
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }
  async set_storage() {
    await this.setStorage.click();
  }
  async set_users() {
    await this.setUsers.click();
  }
  async install() {
    await this.installButton.click();
  }
  async continue() {
    await this.continueButton.click();
  }
}
