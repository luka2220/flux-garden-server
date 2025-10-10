package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/luka2220/flux-garden-server/services/rss"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())

	root := e.Group("/api")
	rssRouter := root.Group("/rss")

	rssRouter.POST("", rss.AddLinkToFeedHanlder)
	rssRouter.POST("/subscribe", rss.SubscribeToRssFeedHandler)

	e.Logger.Fatal(e.Start(":8080"))
}
