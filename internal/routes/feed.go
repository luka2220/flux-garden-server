package routes

import (
	"github.com/luka2220/flux-garden-server/internal/handlers"
	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

func FeedRoutes(router *gin.Engine, db *gorm.DB) {
	feedRouter := router.Group("/feed")

	feedHandler := handlers.FeedHandler{DB: db}

	feedRouter.GET("/", feedHandler.GetFeed)
	feedRouter.POST("/", feedHandler.CreateFeed)
	feedRouter.GET("/:id", feedHandler.GetFeedById)
}
