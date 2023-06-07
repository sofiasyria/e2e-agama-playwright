// Select LVM as the storage device

export class StoragePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
    this.useLVMToggle = page.locator('label').filter({ hasText: /Use logical volume management/ }).locator('span').first();
    this.backButton = page.getByRole('button', { name: 'Back' });
  }
  async useLVM() {
    await this.useLVMToggle.click();
  }
  async backToMainpage() {
    await this.backButton.click();
  }
}
