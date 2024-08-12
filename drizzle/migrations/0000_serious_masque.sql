CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`year` integer NOT NULL,
	`publisher` text NOT NULL,
	`image` text,
	`description` text,
	`rating` integer,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_books_search` ON `books` (`isbn`,`title`,`author`,`publisher`);--> statement-breakpoint
CREATE INDEX `idx_books_year` ON `books` (`year`);--> statement-breakpoint
CREATE INDEX `idx_books_author` ON `books` (`author`);--> statement-breakpoint
CREATE INDEX `idx_books_created_at` ON `books` (`createdAt`);