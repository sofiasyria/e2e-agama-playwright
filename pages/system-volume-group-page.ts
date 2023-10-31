import { expect, type Locator, type Page } from '@playwright/test';

// minute in miliseconds
const minute = 60 * 1000;

export class SystemVolumeGroupPage {
    readonly page: Page;
    readonly acceptButton: Locator;
    readonly availableDevicesList: Locator;
    readonly bootDeviceButton: Locator;
    readonly cancelButton: Locator;      
    readonly customDevicesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.acceptButton = page.getByRole('button', { name: 'Accept' });
        this.availableDevicesList = page.locator('ul[role="listbox"] > li[role="option"]');
        this.bootDeviceButton = page.locator('#bootDevice');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });        
        this.customDevicesButton = page.locator('#customDevices');
    }

    async installationDevice() {
        await expect(this.bootDeviceButton).toBeVisible();
        await this.bootDeviceButton.click();
    }
    
    async customDevices() {
        await expect(this.customDevicesButton).toBeVisible({timeout: 4 * minute});
        await this.customDevicesButton.click();
    }
    
    async selectAvailableDevices() {
        for (let i = 0; i < await this.availableDevicesList.count(); i++) {
            const selected = await this.availableDevicesList.nth(i).getAttribute('aria-selected');
            if (!selected) {
                await this.availableDevicesList.nth(i).click();      
            }
        }    
    }
    
    async accept() {
        await this.acceptButton.click();
    }
    
    async cancel() {
        await this.cancelButton.click();
    }

}
