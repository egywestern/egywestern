CREATE TABLE `pending_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payload` text NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`paymob_order_id` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pending_payments_id` PRIMARY KEY(`id`)
);
