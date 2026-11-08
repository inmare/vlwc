CREATE TABLE `song_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`songId` integer NOT NULL,
	`versionName` text,
	`songLink` text,
	`songInfo` text,
	`lyrics` text,
	FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pageId` integer NOT NULL,
	`title` text NOT NULL,
	`originalTitle` text NOT NULL,
	FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `songs_pageId_unique` ON `songs` (`pageId`);