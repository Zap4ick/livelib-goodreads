import {test, expect, Page} from '@playwright/test';
import {LivelibMyBooksPage} from "./pages/livelib/livelib-my-books-page";
import {LivelibReadPage} from "./pages/livelib/livelib-read-page";
import {LivelibBookPage} from "./pages/livelib/livelib-book-page";
import {FileUtils} from "./utils/file-utils";
import {GoodreadsSearchPage} from "./pages/goodreads/goodreads-search-page";
import {GoodreadsBookPage} from "./pages/goodreads/goodreads-book-page";

let booksWithISBNs: Record<string, number> = {}
let booksWithNoISBN: Record<string, number> = {}
let problemBooks: Record<string, number> = {}

let problemLogFile = '../books-problem.log';
let booksIsbnFile = '../books-isbn.log';
let booksNamesFile = '../books-names.log';
let booksSet = 0
let booksSkipped = 0

test.beforeEach(async ({context}) => {
    if (process.env.LIVELIB_COOKIE == '' || process.env.GOODREADS_COOKIE_1 == '' || process.env.GOODREADS_COOKIE_2 == '') {
        console.warn("Check cookies variables! Stopping the run")
        process.exit(0)
    }

    if (process.env.READ_LIVELIB == 'true' && process.env.LIVELIB_COOKIE !== '') {
        let cookieKey = 'llsid';
        await context.clearCookies({name: cookieKey})
        await context.addCookies([{
            name: cookieKey,
            value: process.env.LIVELIB_COOKIE,
            domain: `${process.env.BASE_URL.replace("https://", "")}`,
            path: '/',
            secure: true,
            expires: Math.floor(Date.now() / 1000) + 3600
        }])
        await context.storageState({path: 'state.json'})
        console.log(
            `Added cookie ${cookieKey} for source`
        )

        await FileUtils.clearBooksFiles()
    }

    if (process.env.FILL_GOODREADS == 'true' && process.env.GOODREADS_COOKIE_1 !== '') {
        let cookieKey = 'at-main';
        await context.clearCookies({name: cookieKey})
        await context.addCookies([{
            name: cookieKey,
            value: process.env.GOODREADS_COOKIE_1,
            domain: `${process.env.TARGET_URL.replace("https://", ".").replace("/search?q=", "")}`,
            path: '/',
            secure: true,
            expires: Math.floor(Date.now() / 1000) + 3600
        }])
        await context.addCookies([{
            name: 'ubid-main',
            value: process.env.GOODREADS_COOKIE_2,
            domain: `${process.env.TARGET_URL.replace("https://", ".").replace("/search?q=", "")}`,
            path: '/',
            secure: true,
            expires: Math.floor(Date.now() / 1000) + 3600
        }])
        await context.storageState({path: 'state.json'})
        console.log(
            `Added cookie ${cookieKey} for target`
        )
    }
})

test('Move books', async ({page}) => {
    if (process.env.READ_LIVELIB == 'true') {
        await page.goto(process.env.BASE_URL);
        let myBooksPage = new LivelibMyBooksPage(page);
        await myBooksPage.clickShowAll()
        await readBooks(page);
    }

    if (process.env.FILL_GOODREADS) {
        if (Object.entries(booksWithISBNs).length == 0 && Object.entries(problemBooks).length == 0 && Object.entries(booksWithNoISBN).length == 0) {
            console.log("Reading books from files")
            booksWithISBNs = await FileUtils.readBooksFromFile(booksIsbnFile)
            booksWithNoISBN = await FileUtils.readBooksFromFile(booksNamesFile)
            problemBooks = await FileUtils.readBooksFromFile(problemLogFile)
        }

        console.log("Starting filling the books");
        await markBooksAndSetRatings(page, booksWithISBNs);
        await markBooksAndSetRatings(page, booksWithNoISBN);
    }
});

test.afterAll(async () => {
    if (Object.entries(problemBooks).length > 0) {
        console.log(`${booksSet} books ratings set, ${booksSkipped} books already have ratings.`)
        console.log(`There were errors. Check ${problemLogFile} for problem books.`)
    }
})

async function readBooks(page: Page) {
    console.log("Starting scrapping the books read")
    let readPage = new LivelibReadPage(page)

    do {
        for (const bookNamesKey of await readPage.getBookNames()) {
            await readPage.clickBookName(bookNamesKey)
            let livelibBookPage = new LivelibBookPage(page);
            let bookISBN = await livelibBookPage.getISBN()
            let rating = parseInt(await livelibBookPage.geMyRating())

            if (bookISBN) {
                bookISBN = bookISBN.split(",")[0]

                if (Number.isNaN(rating)) {
                    processBookWithIsbnAndNoRating(bookNamesKey, bookISBN, rating);
                } else {
                    processBookWithIsbnAndRating(bookNamesKey, bookISBN, rating);
                }

            } else {
                if (Number.isNaN(rating)) {
                    processBookWithNoIsbnAndNoRating(bookNamesKey, rating);
                } else {
                    processBookWithNoIsbn(bookNamesKey, rating);
                }
            }
            await page.goBack()
        }
    } while ((await readPage.clickNextPage()) != null)

    console.log("Finished scrapping the books read")

    function processBookWithIsbnAndNoRating(bookNamesKey: string, bookISBN: string, rating: number) {
        console.warn(`Adding problem book #${Object.entries(problemBooks).length + 1} ${bookNamesKey} (rating not found)`)
        problemBooks [bookISBN] = rating
        FileUtils.addBookToFile(problemLogFile, `${bookISBN.trim()}\n`)
    }

    function processBookWithIsbnAndRating(bookNamesKey: string, bookISBN: string, rating: number) {
        console.log(`Adding book ISBN #${Object.entries(booksWithISBNs).length + 1} ${bookNamesKey}`)
        booksWithISBNs[bookISBN] = rating
        FileUtils.addBookToFile(booksIsbnFile, `${bookISBN.trim()} : ${rating}\n`)
    }

    function processBookWithNoIsbnAndNoRating(bookNamesKey: string, rating: number) {
        console.warn(`Adding problem book #${Object.entries(problemBooks).length + 1} ${problemBooks} (rating not found)`)
        problemBooks [bookNamesKey] = rating
        FileUtils.addBookToFile(problemLogFile, `${bookNamesKey.trim()}}\n`)
    }

    function processBookWithNoIsbn(bookNamesKey: string, rating: number) {
        console.warn(`Adding book name #${Object.entries(booksWithNoISBN).length + 1} ${bookNamesKey} (ISBN not found)`)
        booksWithNoISBN[bookNamesKey] = rating
        FileUtils.addBookToFile(booksNamesFile, `${bookNamesKey.trim()} : ${rating}\n`)
    }
}

async function markBooksAndSetRatings(page: Page, books: Record<string, number>) {
        for (const [bookKey, rating] of Object.entries(books)) {
            await page.goto(process.env.TARGET_URL + bookKey);
            let goodreadsSearchPage = new GoodreadsSearchPage(page)
            if (await goodreadsSearchPage.isPageOpened()) {
                if (await goodreadsSearchPage.isResultPresent()) {
                    await goodreadsSearchPage.clickFirstResult()
                } else if (await goodreadsSearchPage.getCountOfResults() > 0) {
                    let firstResultName = await goodreadsSearchPage.getFirstResultName();
                    if (firstResultName && firstResultName == bookKey) {// full name match
                        await goodreadsSearchPage.clickFirstResult()
                    } else {
                        problemBooks[bookKey] = rating
                        console.warn(`ERROR: Several results for ${bookKey} on target site. Added to problem books file`)
                        continue
                    }
                }
                let goodreadsBookPage = new GoodreadsBookPage(page)
                if (await goodreadsBookPage.isPageOpened()) {
                    await processBookRating(goodreadsBookPage, rating, bookKey);
                } else {
                    problemBooks[bookKey] = rating
                    FileUtils.addBookToFile(problemLogFile, `${bookKey.trim()}\n`)
                    console.warn(`ERROR: No results for ${bookKey} on target site. Added to problem books file`)
                }
            }
        }

    async function processBookRating(goodreadsBookPage: GoodreadsBookPage, rating: number, bookKey: string) {
        let isRatingSet = await goodreadsBookPage.isRatingSet();
        if (!isRatingSet) {
            console.log(`Setting rating ${rating} for book ${bookKey}`)
            await goodreadsBookPage.setRating(rating)
            booksSet++
        } else {
            console.log(`Rating is already set for book ${bookKey}`)
            booksSkipped++
        }
    }
}