package main

import (
	"context"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type serverError struct {
	message string
}

// Model for feed DB table
type Feed struct {
	gorm.Model
	Id        string
	Name      string
	Link      string
	CreatedAt string
	UpdatedAt string
}

type postData struct {
	name string
	link string
}

var posts []postData = []postData{
	{
		name: "Stackoverflow Blog",
		link: "https://stackoverflow.blog/feed",
	},
	{
		name: "Dev.to",
		link: "https://dev.to/feed",
	},
	{
		name: "Freecodecamp",
		link: "https://freecodecamp.org/news/rss",
	},
	{
		name: "r/experienced devs",
		link: "https://www.reddit.com/r/ExperiencedDevs.rss",
	},
	{
		name: "Gitlab Blog",
		link: "https://about.gitlab.com/atom.xml",
	},
	{
		name: "Spotify Engineering",
		link: "https://engineering.atspotify.com/feed",
	},
	{
		name: "r/programming",
		link: "https://www.reddit.com/r/programming/.rss",
	},
	{
		name: "Airbnb Engineering",
		link: "https://medium.com/feed/airbnb-engineering",
	},
}

func Seed(c echo.Context) error {
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

	// Seed in all mock data
	for _, record := range posts {
		err := gorm.G[Feed](db).Create(ctx, &Feed{
			Name:      record.name,
			Link:      record.link,
			Id:        uuid.NewString(),
			CreatedAt: time.Now().Format(time.RFC3339),
			UpdatedAt: time.Now().Format(time.RFC3339),
		})
		if err != nil {
			c.Echo().Logger.Errorf("Error seeding in %v", record)
			return c.JSON(http.StatusInternalServerError, serverError{
				message: "Something went wrong",
			})
		}
	}

	c.Echo().Logger.Print("Seeding data to DB 🌱")
	return c.String(http.StatusOK, "Seeding data")
}

func View(c echo.Context) error {
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
