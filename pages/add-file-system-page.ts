import { expect, type Locator, type Page } from '@playwright/test';

export class AddFileSystemPage {
    readonly page: Page;
    readonly acceptButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.acceptButton = page.getByRole('button', { name: 'Accept' });
    }

    async accept() {
        await this.acceptButton.click();
    }

}
