package rss

import "gorm.io/gorm"

type Feed struct {
	gorm.Model
	Id        string
	Name      string
	Link      string
	CreatedAt string
	UpdatedAt string
}
