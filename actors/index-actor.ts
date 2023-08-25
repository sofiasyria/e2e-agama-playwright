import { type Page } from '@playwright/test';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { MainPage } from '../pages/main-page';

export class IndexActor {
  readonly page: Page;
  readonly mainPage: MainPage;
  readonly productSelectionOpensusePage: ProductSelectionOpensusePage;

  constructor(page: Page, mainPage: MainPage, productSelectionOpensusePage: ProductSelectionOpensusePage) {
    this.page = page;
    this.mainPage = mainPage;
    this.productSelectionOpensusePage = productSelectionOpensusePage; 
  }

  async goto() {
    await this.page.goto('/cockpit/@localhost/agama/index.html');
  }

  async handleProductSelectionIfAny() {
    // possible first pages the user can find
    const actions = Object.freeze({
      setProduct: Symbol("product"),
      setInstall: Symbol("install"),
    });

    // check for multiple texts in parallel, avoid waiting for timeouts
    let action = await Promise.any([
      this.productSelectionOpensusePage.productSelectionText.waitFor().then(() => actions.setProduct),
      this.mainPage.installButton.waitFor().then(() => actions.setInstall),
    ]);

    // optional product selection
    if (action === actions.setProduct) {
        await this.productSelectionOpensusePage.chooseOpensuseTumbleweed();
        await this.productSelectionOpensusePage.select();
    }
  }
}
