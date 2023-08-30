import { expect, type Page } from '@playwright/test';
import { MainPage } from '../pages/main-page';
import { UsersPage } from '../pages/users-page';
import { DefineUserPage } from '../pages/define-user-page';
import { ConfigureRootPasswordPage } from '../pages/configure-root-password-page';

export class UsersActor {
    readonly page: Page;
    readonly mainPage: MainPage;
    readonly usersPage: UsersPage; 
    readonly defineUserPage: DefineUserPage;
    readonly configureRootPasswordPage: ConfigureRootPasswordPage;

    constructor(page: Page,
        mainPage: MainPage,
	usersPage: UsersPage,
        defineUserPage: DefineUserPage,
        configureRootPasswordPage: ConfigureRootPasswordPage) {
        this.page = page;
        this.mainPage = mainPage;
        this.usersPage: UsersPage;
        this.defineUserPage: DefineUserPage;
        this.configureRootPasswordPage: ConfigureRootPasswordPage;
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
