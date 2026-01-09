import {BasePage} from "../base-page";
import {Locator} from "@playwright/test";

export class GoodreadsSearchPage extends BasePage {

    private readonly lnkBookTitle: Locator = this.page.locator("a.bookTitle")
    private readonly frmSearch: Locator = this.page.locator("form.searchBox")

    constructor(page: any) {
        super(page);
    }

    async clickFirstResult() {
        if (await this.isPresent(this.lnkBookTitle))
            await this.lnkBookTitle.click();
        else return null;
    }

    async getFirstResultName(): Promise<string | null> {
        if (await this.getCountOfResults() > 0) {
            await (await this.lnkBookTitle.all())[0].textContent()
        } else return null;
    }

    /**
     * please note that that means only one result
     */
    async isResultPresent() {
        return this.isPresent(this.lnkBookTitle)
    }

    async getCountOfResults() {
        return (await this.lnkBookTitle.all()).length
    }

    async isPageOpened() {
        return this.isPresent(this.frmSearch)
    }

}