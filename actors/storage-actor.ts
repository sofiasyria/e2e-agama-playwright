import { type Page } from '@playwright/test';
import { StoragePage } from '../pages/storage-page';
import { SystemVolumeGroupPage } from '../pages/system-volume-group-page';

export class StorageActor {
    readonly page: Page;
    readonly storagePage: StoragePage;
    readonly systemVolumeGroupPage: SystemVolumeGroupPage;

    constructor(page: Page) {
        this.page = page;
        this.storagePage = new StoragePage(page);
        this.systemVolumeGroupPage = new SystemVolumeGroupPage(page);
    }
  
    async handleLvmAllDevices() {
        await this.storagePage.useLVM();
        await this.storagePage.settingsLVM();
        await this.systemVolumeGroupPage.customDevices();
        await this.systemVolumeGroupPage.selectAvailableDevices();
        await this.systemVolumeGroupPage.accept();
        await this.back();
    }

    async back() {
        await this.storagePage.back();
    }

}
