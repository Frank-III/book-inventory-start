import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Database from 'better-sqlite3';
// import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import {drizzle, BetterSQLite3Database} from "drizzle-orm/better-sqlite3";
import * as schema from "@/schema";
import { createClient } from '@libsql/client';
import { createId } from "@paralleldrive/cuid2";
import { books } from "@/schema";

const parseCSV = async (filePath: string) => {
  const csvFile = fs.readFileSync(path.resolve(filePath), "utf8");
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results: any) => {
        resolve(results.data);
      },
    });
  });
};

// async function seed(db: LibSQLDatabase<typeof schema>) {
async function seed(db: BetterSQLite3Database<typeof schema>) {
  const bookData: Array<Record<string, unknown>> = await parseCSV("./books.csv") as any;

  function escapeSQLString(str: string) {
    return String(str).replace(/'/g, "''");
  }
  // Inserting book data into the books table
  const inserts = bookData.map((book, index) => {
    // An error occurred while attempting to seed the database: error: null value in column "isbn" of relation "books" violates not-null constraint
    if (!book.isbn) {
      console.error(`Skipping book at index ${index} due to missing ISBN`);
    }

    if (!book.publisher || !book.publishDate || !book.isbn) {
      return false;
    }
    const Id = createId()
    // a function to parse from: "November 14th 2003" to 2003
    const publishedDate = parseInt((book.publishDate as string).split(" ").slice(-1)[0]);
    if (!publishedDate) {
      return false;
    }

    return {
      id: Id,
      isbn: book.isbn as string,
      title: book.title as string,
      author: escapeSQLString(book.title as string),
      year: publishedDate,
      publisher: escapeSQLString(book.publisher as string),
      image: book.coverImg as string,
      description: escapeSQLString(book.description as string),
      rating: parseFloat(book.rating as string),
    }
//     return `
// INSERT INTO books ("id", "isbn", "title", "author", "year", "publisher", "image", "description", "rating")
// VALUES ('${Id}', '${book.bookId}', '${escapeSQLString(book.title)}', '${escapeSQLString(book.author)}', ${publishedDate}, '${escapeSQLString(book.publisher)}', '${book.coverImg}', '${escapeSQLString(book.description)}', ${book.rating});
//     `;
  });
  // fs.writeFileSync(
  //   "../drizzle/migrations/0001-create-books-table.sql",
  //   inserts
  //     .filter((x) => x !== false)
  //     .slice(0, 2000)
  //     .join(""),
  // );
  console.log(inserts)
  await db.insert(books).values(inserts.filter((x) => x !== false).slice(0,3000)).execute()
  console.info(
    `Successfully seeded the database with ${bookData.length} books`,
  );
}

async function main() {
  // const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN });
  const client = new Database('../sqlite.db');
  const db = drizzle(client, { schema, logger: true });
  await seed(db);
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
