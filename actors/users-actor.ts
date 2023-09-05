import { expect, type Page } from '@playwright/test';
import { MainPage } from '../pages/main-page';
import { UsersPage } from '../pages/users-page';

export class UsersActor extends UsersPage {
    readonly page: Page;
    readonly mainPage: MainPage;

    constructor(page: Page,
        mainPage: MainPage) {
        this.page = page;
        this.mainPage = mainPage;
        this.usersPage = UsersPage;
        this.defineUserPage = DefineUserPage;
        this.configureRootPasswordPage = ConfigureRootPasswordPage;
    }

    async createUserAndDefineRootPassword() {
        await this.mainPage.accessUsers();
        await this.usersPage.expectNoUserDefined();
        await this.usersPage.defineUser();
        await this.defineUserPage.fillUserFullName('Bernhard M. Wiedemann');
        await this.defineUserPage.fillUserName('bernhard');
        await this.defineUserPage.fillAndConfirmPassword('nots3cr3t');
        await this.defineUserPage.confirm();
        await this.usersPage.expectRootPasswordNotSet();
        await this.usersPage.configureRootPassword();
        await this.configureRootPasswordPage.fillAndConfirmPassword('nots3cr3t');
        await this.configureRootPasswordPage.confirm();
        await this.usersPage.back();
    }
}
