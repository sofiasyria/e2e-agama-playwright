import { expect, type Locator, type Page } from '@playwright/test';

export class StoragePage {
    readonly page: Page;
    readonly useEncryptionToggle: Locator;
    readonly encryptionEnabled: Locator;
    readonly useLVMToggle: Locator;
    readonly settingsLVMButton: Locator;
    readonly backButton: Locator;
    readonly actionsAddFileSystemButton: Locator;
    readonly addFileSystemText: Locator;
    readonly swapPartitionText: Locator;
    readonly installationDeviceLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.useEncryptionToggle = page.getByRole('checkbox', { name: 'Use encryption' });
        this.encryptionEnabled = page.getByRole('button', { name: 'Encryption settings' });
        this.useLVMToggle = page.locator('#lvm');
        this.settingsLVMButton = page.locator('button[aria-label="LVM settings"]');
        this.installationDeviceLink = page.getByRole('button', { name: /\/dev\/.d.\,\ [0-9]*\ .iB/ } );
        this.backButton = page.getByRole('button', { name: 'Back' });
        this.actionsAddFileSystemButton = page.getByRole('button', { name: 'Actions' }).first();
        this.addFileSystemText = page.getByText('Add file system', { exact: true });
        this.swapPartitionText = page.getByText('Swap partition');
    }

    async useEncryption() {
        await this.useEncryptionToggle.check();
    }
  
    async validateEncryptionIsUsed() {
        expect(await this.useEncryptionToggle.isChecked()).toBeTruthy();
    }

    async useLVM() {
        await this.useLVMToggle.check();
    }

    async settingsLVM() {
        await this.settingsLVMButton.click();
    }

    async accessAddFileSystem() {
        await expect(this.swapPartitionText).toBeVisible();
        await this.actionsAddFileSystemButton.click();
        await expect(this.addFileSystemText).toBeEnabled();
        await this.addFileSystemText.click();
    }

    async accessInstallationDevice() {
        await expect(this.installationDeviceLink).toBeVisible();
        await this.installationDeviceLink.click();
    }
    
    async back() {
        await this.backButton.click();
    }
}
