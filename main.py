import logging
from typing import List

import bleach
import feedparser
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlmodel import Session as SQLSession
from sqlmodel import select

from models import Feed, get_session, initalize_db

app = FastAPI()

logger = logging.getLogger("flux-garden-logger")

origins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://127.0.0.1:64805"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    initalize_db()


@app.get("/feed")
def fetch_feed(session: SQLSession = Depends(get_session)):
    query = select(Feed)
    results = session.exec(query).all()

    return results


class FeedSchema(BaseModel):
    name: str
    link: str


@app.post("/feed")
def create_feed(feed: FeedSchema, session: SQLSession = Depends(get_session)):
    new_feed = Feed(name=feed.name, link=feed.link)
    session.add(new_feed)
    session.commit()

    return "ok"


class FeedItem(BaseModel):
    """
    Item type of a parsed feed with sanitized conten
    """

    title: str
    link: str
    content_html: str


class FeedContent(BaseModel):
    """
    Content type of a parsed feed
    """

    title: str
    link: str
    description: str
    feed: list[FeedItem]


class FeedWithContent(BaseModel):
    """
    Response type of fetching a single feed
    """

    item: Feed
    content: FeedContent


@app.get("/feed/{id}", response_model=FeedWithContent)
def fetch_feed_by_id(id: str, session: SQLSession = Depends(get_session)):
    """
    Fetches the rss content from the stored link
    """
    try:
        query = select(Feed).where(Feed.id == id)
        result = session.exec(query).all()

        if len(result) == 0:
            return JSONResponse(status_code=404, content="No feed found with that id")

        rss_record = result[0]
        rss_page = feedparser.parse(rss_record.link)

        feed_items: List[FeedItem] = []
        for entry in rss_page.entries:
            sanatized_content = bleach.clean(
                entry.description, tags=bleach.ALLOWED_TAGS
            )
            feed_items.append(
                FeedItem(
                    title=entry.title, link=entry.link, content_html=sanatized_content
                )
            )

        feed_content = FeedContent(
            title=rss_page.feed.title,
            link=rss_page.feed.link,
            description=rss_page.feed.description,
            feed=feed_items,
        )

        return {"item": rss_record, "content": feed_content}
    except Exception as e:
        logger.error(e)
        return JSONResponse(status_code=500, content="Something went wrong")
