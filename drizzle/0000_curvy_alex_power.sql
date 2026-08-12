CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `collections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_name_unique` ON `collections` (`name`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`collection` text DEFAULT 'NEW DROPS' NOT NULL,
	`price` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`sizes` text DEFAULT '' NOT NULL,
	`colors` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `categories` (`name`) VALUES ('T-SHIRTS'), ('HOODIES'), ('CARGOS'), ('JACKETS'), ('CAPS'), ('ACCESSORIES');
--> statement-breakpoint
INSERT INTO `collections` (`name`) VALUES ('NEW DROPS'), ('SUMMER 26'), ('WINTER COLLECTION'), ('BEST SELLERS'), ('LIMITED EDITION');
