CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`pageTitle` text NOT NULL,
	`infoTable` text NOT NULL,
	`lyricsTable` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_url_unique` ON `pages` (`url`);