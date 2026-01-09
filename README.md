[![Playwright Tests](https://github.com/Zap4ick/livelib-goodreads/actions/workflows/playwright.yml/badge.svg)](https://github.com/Zap4ick/livelib-goodreads/actions/workflows/playwright.yml)

# LiveLib - Goodreads ratings mover
This is a script to move ratings from books tracking site LiveLib to GoodReads.

# Using

Open dev tools (F12) on livelib site and get _llsid_ cookie value on "application page". Set it to env variable _LIVELIB_COOKIE_ in the .env file.<br>
Open dev tools on goodreads site and get _at-main_ and _ubid-main_ cookies values. Set them to env variables _GOODREADS_COOKIE_1_ and _GOODREADS_COOKIE_2_ in the .env file.<br>
Option _READ_LIVELIB_ turns scraping and saving to files on.<br>
Option _FILL_GOODREADS_ turns filling on, from files or on the fly if READ_LIVELIB is on.<br>
Play with them to run the script step by step if needed.<br>
<br>
The script first tries to find books by isbn then by name. Searching by name is the most unreliable so check problems file to rate missing books manually.<br>
<br>
Run [goodreads.test.ts](tests/goodreads.test.ts). <br>
Files created are: _books-isbn.log_, _books-names.log_, _books-problem.log_.<br>

Headless mode is turned off in [playwright.config.ts](playwright.config.ts).<br>
Timeout for the script is set in [playwright.config.ts](playwright.config.ts).

# Technologies

Build with Playwright and TypeScript.

