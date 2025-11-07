package main

import (
	"github.com/luka2220/flux-garden-server/internal/models"
	"github.com/luka2220/flux-garden-server/internal/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func main() {
	db, err := gorm.Open(sqlite.Open("db.sqlite3"), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	})
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}

	db.AutoMigrate(&models.Feed{})

	router := gin.Default()

	routes.FeedRoutes(router, db)

	router.Run(":8000")
}
