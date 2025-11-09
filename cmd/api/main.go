package main

import (
	"time"

	"github.com/gin-contrib/cors"
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

	router.Use(cors.New(cors.Config{
		AllowOrigins:  []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:  []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders: []string{"Content-Length"},
		MaxAge:        12 * time.Hour,
	}))

	routes.FeedRoutes(router, db)

	router.Run(":8000")
}
