import {Locator, Page} from "@playwright/test";

export class BasePage {
    readonly page: Page;

    constructor(page: any) {
        this.page = page;
    }

    async open(url: string) {
        await this.page.goto(url);
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }

    protected async isPresent(locator: Locator): Promise<boolean> {
        try {
            return await locator.isEnabled({timeout: 3000})
        } catch (e) {
            return false
        }
    }
}