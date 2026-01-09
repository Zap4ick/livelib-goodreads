import {BasePage} from "../base-page";
import {expect, Locator} from "@playwright/test";

export class LivelibReadPage extends BasePage {

    private readonly btnNextPage: Locator = this.page.locator("//a[contains(@id,'a-list-page-next-')]")
    private readonly lnkBookNames: Locator = this.page.locator("a.brow-book-name")

    constructor(page: any) {
        super(page);
    }

    async waitForLoading() {
        await expect(this.lnkBookNames).toHaveCount(20)
    }

    async clickBookName(bookName: string) {
        await this.page.getByRole('link', {name: bookName, exact: true}).first().click();
    }

    async clickNextPage(): Promise<boolean | null> {
        if (await this.isPresent(this.btnNextPage)) {
            await this.btnNextPage.click();
            return true
        } else return null
    }

    async nextPageExists(): Promise<boolean | null> {
        return this.btnNextPage.isVisible()
    }

    async getBookNames(): Promise<string[] | null> {
        return this.lnkBookNames.allTextContents()
    }

}