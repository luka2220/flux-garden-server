## TODOs

## Priority

- [ ] Setup custom proxy with hostinger
- [ ] Setup proxy for fetching feeds that may block cloudflare domains
- [ ] Test full oauth implementation
- [ ] Write bun unit tests for oauth logic
- [ ] Write integration tests with vitest & @cloudflare/vitest-pool-workers
- [ ] Add in cloudflare secret for the frontend domain
- [ ] Figure out how to store feed items permanently went fecthed once from an rss feed
- [x] Add in hono

## Medium

- [ ] Add some retry logic with differnt proxies when fetching a feed gets blocked
- [ ] Add in tags for each feed when created
- [x] Start implementing some basic authentication
- [x] Get a development evironment set up

## Features

- [ ] Add a search functionality for rss feeds based on a category (software, technical, finanace)
- [ ] Add a way to display links in rss feeds based on subscribed topics

## Functionality

- [ ] Add a background task/cron job daily to fetch all feeds

## Bugs
