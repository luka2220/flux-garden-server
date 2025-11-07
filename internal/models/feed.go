package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Feed struct {
	Id        string    `gorm:"primaryKey;type:varchar(255)"`
	Url       string    `gorm:"not null"`
	Name      string    `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (f *Feed) BeforeCreate(tx *gorm.DB) error {
	f.Id = uuid.New().String()
	return nil
}

// Override the default table name to be "feed"
func (Feed) TableName() string {
	return "feed"
}
