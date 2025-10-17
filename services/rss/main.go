package rss

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type serverError struct {
	message string
}

type addLinkToFeedSchema struct {
	Link string `json:"link"`
	Name string `json:"name"`
}

type subscribeToRssFeedSchema struct {
	Link string `json:"link"`
	Name string `json:"name"`
}

// Add an rss link to the feed
func AddLinkToFeedHanlder(c echo.Context) error {
	body := new(addLinkToFeedSchema)
	if err := c.Bind(body); err != nil {
		return err
	}

	fmt.Println(body)

	return c.String(http.StatusOK, "Route for adding an RSS link to the feed")
}

// Create an rss subscription to an external feed
func SubscribeToRssFeedHandler(c echo.Context) error {
	body := new(subscribeToRssFeedSchema)
	if err := c.Bind(body); err != nil {
		return err
	}

	fmt.Println(body)

	return c.String(http.StatusOK, "Route for subscribing to an external RSS feed")
}

// Fetch all rss feeds in DB
func FetchAllFeeds(c echo.Context) error {
	db, err := gorm.Open(sqlite.Open("./db/database.db"), &gorm.Config{})
	if err != nil {
		c.Echo().Logger.Error("Error opening DB")
		return c.JSON(http.StatusInternalServerError, serverError{
			message: "Something went wrong.",
		})
	}

	ctx := context.Background()
	// migrate the schema
	db.AutoMigrate(&Feed{})

	seed, err := gorm.G[Feed](db).Raw("select * from feeds").Find(ctx)
	if err != nil {
		c.Echo().Logger.Error("Error fetching data", err)
		return c.JSON(http.StatusInternalServerError, serverError{
			message: "Something went wrong",
		})
	}

	c.Echo().Logger.Info(seed)

	return c.JSON(http.StatusOK, seed)
}
