import { type Page } from '@playwright/test';
import { ConfigureRootPasswordPage } from '../pages/configure-root-password-page';
import { DefineUserPage } from '../pages/define-user-page';
import { UsersPage } from '../pages/users-page';

interface User {
    fullname: string,
    username: string,
    password: string
}

export class UserActor {
    readonly page: Page;
    readonly usersPage: UsersPage;
    readonly defineUserPage: DefineUserPage;
    readonly configureRootPasswordPage: ConfigureRootPasswordPage;

    static readonly user: User = {
        fullname: 'Bernhard M. Wiedemann',
        username: 'bernhard',
        password: 'nots3cr3t'
    };

    constructor(page: Page) {
        this.page = page;
        this.usersPage = new UsersPage(page);
        this.defineUserPage = new DefineUserPage(page);
        this.configureRootPasswordPage = new ConfigureRootPasswordPage(page);
    }
  
    async handleUser() {
        await this.defineUser(UserActor.user);
        await this.setRootPassword(UserActor.user.password);
        await this.back();
    }

    async defineUser(user: User) {
        await this.usersPage.expectNoUserDefined();
        await this.usersPage.defineUser();
        await this.defineUserPage.fillUserFullName(user.fullname);
        await this.defineUserPage.fillUserName(user.username);
        await this.defineUserPage.fillAndConfirmPassword(user.password);
        await this.defineUserPage.confirm();
    }

    async setRootPassword(password: string) {
        await this.usersPage.expectRootPasswordNotSet();
        await this.usersPage.configureRootPassword();
        await this.configureRootPasswordPage.fillAndConfirmPassword(password);
        await this.configureRootPasswordPage.confirm();
    }

    async back() {
        await this.usersPage.back();
    }

}
