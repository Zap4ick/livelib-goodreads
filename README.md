[![CI](https://github.com/Zap4ick/gatling-sample/actions/workflows/blank.yml/badge.svg)](https://github.com/Zap4ick/gatling-sample/actions/workflows/blank.yml)

# LiveLib - Goodreads ratings mover
This is a script to move ratings from books tracking site LiveLib to GoodReads.

# Using

Open dev tools (F12) on livelib site and get **llsid** cookie value on "application page". Set it to env variable **LIVELIB_COOKIE** in the .env file.
Open dev tools on goodreads site and get **at-main** and **ubid-main** cookies values. Set them to env variables **GOODREADS_COOKIE_1** and **GOODREADS_COOKIE_2** in the .env file.
Option **READ_LIVELIB** turns scraping and saving to files on.
Option **FILL_GOODREADS** turns filling on, from files or on the fly if READ_LIVELIB is on.
Play with them to run the script step by step if needed.
The script first tries to find books by isbn then by name. Searching by name is the most unreliable so check problems file to rate missing books manually.
Files created are: _books-isbn.log_, _books-names.log_, _books-problem.log_.

# Technologies

Build with Playwright and TypeScript.

