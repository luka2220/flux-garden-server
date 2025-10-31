from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from models import initalize_db, Feed, get_session
from sqlmodel import Session as SQLSession, select
import logging

app = FastAPI()

logger = logging.getLogger("flux-garden-logger")


@app.on_event("startup")
def on_startup():
    initalize_db()


@app.get("/feed")
def fetch_feed(session: SQLSession = Depends(get_session)):
    query = select(Feed)
    results = session.exec(query).all()

    print(f"results: {results}")

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


@app.get("/feed/{id}")
def fetch_feed_by_id(id: str, session: SQLSession = Depends(get_session)):
    try:
        query = select(Feed).where(Feed.id == id)
        result = session.exec(query).all()

        if len(result) == 0:
            return JSONResponse(status_code=404, content="No feed found with that id")

        return result[0]
    except Exception as e:
        logger.error(e)
        return JSONResponse(status_code=500, content="Something went wrong")
