import {BasePage} from "../base-page";
import {Locator} from "@playwright/test";

export class LivelibBookPage extends BasePage {

    private readonly lblISBNumber: Locator = this.page.locator("p.bc-info__txt > span:not(.br)")
    private readonly lblMyRating: Locator = this.page.locator("span.bc-rating__my-rating")

    constructor(page: any) {
        super(page);
    }

    async getISBN(): Promise<string | null> {
        if (await this.isPresent(this.lblISBNumber))
            return await this.lblISBNumber.textContent();
        else return null;
    }

    async geMyRating(): Promise<string | null> {
        if (await this.isPresent(this.lblMyRating))
            return await this.lblMyRating.textContent();
        else return null;
    }

}