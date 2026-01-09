//import fs from 'fs-extra';
import {promises as fs} from 'fs';
import path = require("node:path");

export class FileUtils {

    static addBookToFile(file: string, bookISBN: string) {
        const logPath = path.resolve(__dirname, file);
        fs.appendFile(logPath, bookISBN, 'utf-8');
    }

    static async readBooksFromFile(file: string): Promise<Record<string, number>[]> {
        const logPath = path.resolve(__dirname, file);
        let dataString = await fs.readFile(logPath, 'utf-8');
        if (dataString) {
            return dataString.split('\n')
                .map(bookString => bookString.split(': '))
                .map(([key, value]) => ({
                    [key]: parseInt(value)
                }));
        } else return []
    }

    static async clearBooksFiles() {
        ['../books-isbn.log', '../books-names.log', '../books-problem.log'].forEach( fileName => {
            const logPath = path.resolve(__dirname, fileName);
            fs.writeFile(logPath, '', 'utf-8');
        })
    }
}