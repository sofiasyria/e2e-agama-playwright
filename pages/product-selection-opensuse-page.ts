import { test, expect } from '@playwright/test';

export class ProductSelectionOpensusePage {
    readonly page: Page;
    readonly productSelectionText: Locator;
    readonly opensuseTumbleweedLabel: Locator;
    readonly opensuseLeapLabel: Locator;
    readonly selectButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productSelectionText = page.getByText('Product selection');
        this.opensuseTumbleweedLabel = page.getByLabel('openSUSE Tumbleweed');
        this.opensuseLeapLabel = page.getByLabel('openSUSE Leap 16.0');
        this.selectButton = page.getByRole('button', { name: 'Select' });
    }

    async chooseOpensuseTumbleweed() {
        await this.opensuseTumbleweedLabel.check();
    }

    async chooseOpensuseLeap() {
        await this.opensuseLeapLabel.check();
    }

    async select() {
        await this.selectButton.click();
    }
}
