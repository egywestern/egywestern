CREATE TABLE `product_color_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`color` varchar(50) NOT NULL,
	`image` text NOT NULL,
	CONSTRAINT `product_color_images_id` PRIMARY KEY(`id`)
);
