package rss

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
)

type serverError struct {
	message string
}

type addLinkToFeedSchema struct {
	Link string `json:"link"`
	Name string `json:"name"`
}

// Add an rss link to the feed
func AddLinkToFeedHanlder(c echo.Context) error {
	body := new(addLinkToFeedSchema)
	if err := c.Bind(body); err != nil {
		return err
	}

	db, ok := c.Get("db").(*sql.DB)
	if !ok || db == nil {
		c.Echo().Logger.Error("db not available in context")
		return c.JSON(http.StatusInternalServerError, serverError{message: "Something went wrong."})
	}

	id := uuid.New().String()
	createdAt := time.Now().UTC().Format(time.RFC3339)

	if _, err := db.Exec("INSERT INTO Feeds (id, created_at, updated_at, name, link) VALUES (?, ?, ?, ?, ?)", id, createdAt, createdAt, body.Name, body.Link); err != nil {
		c.Echo().Logger.Error("Unable to insert data into db: ", err.Error())
		return c.JSON(http.StatusInternalServerError, serverError{message: "Something went wrong."})
	}

	return c.NoContent(http.StatusOK)
}

// Fetch all rss feeds in DB
func FetchAllFeeds(c echo.Context) error {
	db, ok := c.Get("db").(*sql.DB)
	if !ok || db == nil {
		c.Echo().Logger.Error("db not available in context")
		return c.JSON(http.StatusInternalServerError, serverError{message: "Something went wrong."})
	}

	rows, err := db.Query("select * from feeds")
	if err != nil {
		c.Echo().Logger.Error("Error opening db connection: ", err.Error())
		return c.JSON(http.StatusInternalServerError, serverError{
			message: "Something went wrong.",
		})
	}

	defer rows.Close()

	feed := make([]Feed, 5)

	for rows.Next() {
		var f Feed

		err := rows.Scan(&f.Id, &f.CreatedAt, &f.UpdatedAt, &f.Name, &f.Link)
		if err != nil {
			c.Echo().Logger.Error("Scanning DB row: ", err.Error())
			return c.JSON(http.StatusInternalServerError, serverError{
				message: "Something went wrong.",
			})
		}

		feed = append(feed, f)
	}

	c.Echo().Logger.Info(feed)

	return c.JSON(http.StatusOK, "fetched")
}
