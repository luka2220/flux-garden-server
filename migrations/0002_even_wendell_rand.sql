ALTER TABLE `feeds` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `feeds` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN "photoUrl" TO "photo_url";--> statement-breakpoint
ALTER TABLE `users` ADD `refresh_token` text NOT NULL;