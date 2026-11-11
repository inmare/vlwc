CREATE TABLE `lyrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text
);
--> statement-breakpoint
ALTER TABLE `song_versions` ADD `lyricsId` integer NOT NULL REFERENCES lyrics(id);--> statement-breakpoint
ALTER TABLE `song_versions` ADD `versionIndex` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `song_versions` ADD `credits` text;--> statement-breakpoint
ALTER TABLE `song_versions` DROP COLUMN `songInfo`;--> statement-breakpoint
ALTER TABLE `song_versions` DROP COLUMN `lyrics`;