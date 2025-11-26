from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from sqlmodel import Session as SQLSession
from sqlmodel import select

from lib.models.feeds import Feeds, get_session, initalize_db
from lib.schemas.feed import FeedSchema

app = FastAPI()


@app.on_event("startup")
def on_startup():
    initalize_db()


@app.get("/feed")
def fetch_feed(session: SQLSession = Depends(get_session)):
    query = select(Feeds)
    results = session.exec(query).all()

    print(f"results: {results}")

    return results


@app.post("/feed")
def fecth_feed(feed: FeedSchema, session: SQLSession = Depends(get_session)):
    new_feed = Feeds(name=feed.name, link=feed.link)
    session.add(new_feed)
    session.commit()

    return JSONResponse(status_code=200, content="ok")
