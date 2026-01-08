CREATE TABLE `feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`link` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_feeds` (
	`user_id` text NOT NULL,
	`feed_id` text NOT NULL,
	`subscribed_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `feed_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
