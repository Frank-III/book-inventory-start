import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { createId } from "@paralleldrive/cuid2";

const parseCSV = async (filePath) => {
  const csvFile = fs.readFileSync(path.resolve(filePath), "utf8");
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

async function seed() {
  const bookData = await parseCSV("./books.csv");

  function escapeSQLString(str) {
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

    // a function to parse from: "November 14th 2003" to 2003
    const publishedDate = parseInt(book.publishDate.split(" ").slice(-1)[0]);
    if (!publishedDate) {
      return false;
    }
    return `
INSERT INTO books ("id", "isbn", "title", "author", "year", "publisher", "image", "description", "rating")
VALUES ('${createId()}', '${book.bookId}', '${escapeSQLString(book.title)}', '${escapeSQLString(book.author)}', ${publishedDate}, '${escapeSQLString(book.publisher)}', '${book.coverImg}', '${escapeSQLString(book.description)}', ${book.rating});
    `;
  });
  fs.writeFileSync(
    "../drizzle/migrations/0001-create-books-table.sql",
    inserts
      .filter((x) => x !== false)
      .slice(0, 2000)
      .join(""),
  );
  console.info(
    `Successfully seeded the database with ${bookData.length} books`,
  );
}

async function main() {
  await seed();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
