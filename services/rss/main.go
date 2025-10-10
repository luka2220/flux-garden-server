package rss

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

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

// Create an rss subscription to an external deed
func SubscribeToRssFeedHandler(c echo.Context) error {
	body := new(subscribeToRssFeedSchema)
	if err := c.Bind(body); err != nil {
		return err
	}

	fmt.Println(body)

	return c.String(http.StatusOK, "Route for subscribing to an external RSS feed")
}
