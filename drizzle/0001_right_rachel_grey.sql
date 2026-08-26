CREATE TABLE `site_settings` (
	`id` int NOT NULL DEFAULT 1,
	`hero_image` text NOT NULL,
	`campaign_image` text NOT NULL,
	`story_image` text NOT NULL,
	`about_image` text NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
