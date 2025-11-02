## Tasks

- [x] Parse the rss xml page and sanatize it for the client
- [x] Return the parsed rss xml to the client as structured JSON so that it is easy for the client to render
- [x] Each entry in the response array should include both `content_html` (sanitized) and `content_text` so the client can either render formatted HTML or plain text safely
- [x] Implement `feedparser` to parse rss xml
- [x] Implement `bleach` html sanatizing
- [ ] Use an async DB engine for sqlite

## Features

- [ ] Add a search functionality for rss feeds based on a domain
- [ ] Add a way to display links in rss feeds based on subscribed topics
