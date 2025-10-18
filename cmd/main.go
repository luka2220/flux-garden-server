package main

import (
	"database/sql"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/luka2220/flux-garden-server/services/rss"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	e := echo.New()

	dbConn, err := sql.Open("sqlite3", "./db/database.db")
	if err != nil {
		e.Logger.Fatal("Error opening DB connection")
	}

	// Inject db reference into echo context
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("db", dbConn)
			return next(c)
		}
	})

	// Cors setup
	e.Use(middleware.CORSWithConfig(
		middleware.CORSConfig{
			AllowOrigins: []string{"http://localhost:5173"},
		},
	))

	e.Use(middleware.Logger())
	e.Logger.SetLevel(log.DEBUG)

	root := e.Group("/api")
	rssRouter := root.Group("/rss")

	rssRouter.POST("", rss.AddLinkToFeedHanlder)
	rssRouter.GET("", rss.FetchAllFeeds)

	e.Logger.Fatal(e.Start(":8080"))
}
