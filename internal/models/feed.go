package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Feed struct {
	Id        string    `gorm:"primaryKey;type:varchar(255)" json:"id"`
	Url       string    `gorm:"not null" json:"url"`
	Name      string    `gorm:"not null" json:"name"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (f *Feed) BeforeCreate(tx *gorm.DB) error {
	f.Id = uuid.New().String()
	return nil
}

// Override the default table name to be "feed"
func (Feed) TableName() string {
	return "feed"
}
