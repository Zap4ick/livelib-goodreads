import {BasePage} from "../base-page";
import {Locator} from "@playwright/test";

export class GoodreadsBookPage extends BasePage {

    private readonly btnRatingStar: Locator = this.page.locator("div.Sticky button.RatingStar--selectable")
    private readonly lblRead: Locator = this.page.locator("article.WriteReviewCTA")
    private readonly pageLocator: Locator = this.page.locator("div.BookPage__gridContainer")

    constructor(page: any) {
        super(page);
    }

    async isRatingSet() {
        return !(await this.isPresent(this.lblRead))
    }

    async isPageOpened() {
        return this.isPresent(this.pageLocator)
    }

    async setRating(rating: number) {
        await (await this.btnRatingStar.all())[rating-1].click({delay : 500})
    }

}