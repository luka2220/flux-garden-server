from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from models import initalize_db, Feed, get_session
from sqlmodel import select
from sqlmodel import Session as SQLSession

app = FastAPI()


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
def fecth_feed(feed: FeedSchema, session: SQLSession = Depends(get_session)):
    new_feed = Feed(name=feed.name, link=feed.link)
    session.add(new_feed)
    session.commit()

    return JSONResponse(status_code=200, content="ok")
