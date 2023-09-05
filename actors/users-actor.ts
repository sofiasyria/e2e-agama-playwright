import { expect, type Page } from '@playwright/test';
import { MainPage } from '../pages/main-page';
import { UsersPage } from '../pages/users-page';

export class UsersActor extends UsersPage {
    readonly page: Page;
    readonly mainPage: MainPage;

    constructor(page: Page,
        mainPage: MainPage) {
        super.page = page;
        page.mainPage = mainPage;
        page.usersPage = UsersPage;
        page.defineUserPage = DefineUserPage;
        page.configureRootPasswordPage = ConfigureRootPasswordPage;
    }

    async createUserAndDefineRootPassword() {
        await page.mainPage.accessUsers();
        await page.usersPage.expectNoUserDefined();
        await page.usersPage.defineUser();
        await page.defineUserPage.fillUserFullName('Bernhard M. Wiedemann');
        await page.defineUserPage.fillUserName('bernhard');
        await page.defineUserPage.fillAndConfirmPassword('nots3cr3t');
        await page.defineUserPage.confirm();
        await page.usersPage.expectRootPasswordNotSet();
        await page.usersPage.configureRootPassword();
        await page.configureRootPasswordPage.fillAndConfirmPassword('nots3cr3t');
        await page.configureRootPasswordPage.confirm();
        await page.usersPage.back();
    }
}
