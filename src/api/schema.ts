import { sql } from "drizzle-orm/sql";
import { integer, text, sqliteTable, index } from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';


export const books = sqliteTable(
  'books',
  {
    id: text('id').primaryKey().$default(() => createId()),
    isbn: text('isbn').notNull(),
    title: text('title').notNull(),
    author: text('author').notNull(),
    year: integer('year').notNull(),
    publisher: text('publisher').notNull(),
    image: text('image'),
    description: text('description'),
    rating: integer('rating'),
    createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      searchIdx: index('idx_books_search').on(
        table.isbn,
        table.title,
        table.author,
        table.publisher
      ),
      yearIdx: index('idx_books_year').on(table.year),
      authorIdx: index('idx_books_author').on(table.author),
      createdAtIdx: index('idx_books_created_at').on(table.createdAt),
    };
  }
);