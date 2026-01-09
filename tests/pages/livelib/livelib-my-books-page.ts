import {BasePage} from "../base-page";
import {Locator} from "@playwright/test";

export class LivelibMyBooksPage extends BasePage {

    private readonly btnShowAll : Locator = this.page.locator("div.with-mpad > a")

    constructor(page: any) {
        super(page);
    }

    async clickShowAll(){
        await this.btnShowAll.click();
    }

}