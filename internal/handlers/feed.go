package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/luka2220/flux-garden-server/internal/models"
	"github.com/mmcdole/gofeed"
	"gorm.io/gorm"
)

type FeedHandler struct {
	DB *gorm.DB
}

func (h *FeedHandler) GetFeed(c *gin.Context) {
	var feeds []models.Feed

	if err := h.DB.Find(&feeds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to fetch feeds",
		})
		return
	}

	c.JSON(http.StatusOK, feeds)
}

func (h *FeedHandler) CreateFeed(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to read request body",
		})
		return
	}

	type FeedRequest struct {
		Link string `json:"link"`
		Name string `json:"name"`
	}
	feedRequestBody := FeedRequest{}
	err = json.Unmarshal(body, &feedRequestBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to unmarshal request body",
		})
		return
	}

	feed := models.Feed{
		Url:  feedRequestBody.Link,
		Name: feedRequestBody.Name,
	}

	if err := h.DB.Create(&feed).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create feed",
		})
		return
	}

	c.JSON(http.StatusOK, "ok")
}

func (h *FeedHandler) GetFeedById(c *gin.Context) {
	id := c.Param("id")

	feed := models.Feed{}
	if err := h.DB.Where("id = ?", id).First(&feed).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Feed not found",
		})
		return
	}

	// TODO: Fetch the rss xml page and parse it
	// TODO: Sanatize the html

	fp := gofeed.NewParser()

	parsedFeed, err := fp.ParseURL(feed.Url)
	if err != nil {
		fmt.Println("An error occurred parsing the feed: ", err)
		c.JSON(http.StatusInternalServerError, "Something went wrong")
		return
	}

	// TODO: Return the parsed feed title, author, and description
	// TODO: Consctruct elements for each link in the feed i.e title, link, description

	type parsedFeedData struct {
		Title        string        `json:"title"`
		Link         string        `json:"link"`
		Content_html string        `json:"content_html"`
		Image        *gofeed.Image `json:"image"`
	}

	feedItems := make([]parsedFeedData, 0, len(parsedFeed.Items))

	for _, item := range parsedFeed.Items {
		feedItems = append(feedItems, parsedFeedData{
			Title:        item.Title,
			Link:         item.Link,
			Content_html: item.Content,
			Image:        item.Image,
		})
	}

	type content struct {
		Title       string           `json:"title"`
		Link        string           `json:"link"`
		Description string           `json:"description"`
		Feed        []parsedFeedData `json:"feed"`
	}

	c.JSON(http.StatusOK, gin.H{
		"item": feed,
		"content": content{
			Title:       parsedFeed.Title,
			Link:        parsedFeed.Link,
			Description: parsedFeed.Description,
			Feed:        feedItems,
		},
	})
}
