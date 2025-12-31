import logging
import ssl
from contextlib import asynccontextmanager

import certifi
import feedparser
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from internal.feed import construct_feed
from models.feed import Feeds, get_session, initalize_db

ssl._create_default_https_context = lambda: ssl.create_default_context(
    cafile=certifi.where()
)


logging.basicConfig(
    level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Server starting...')
    initalize_db()
    yield
    logger.info('Server stopped running...')


app = FastAPI(lifespan=lifespan)

origins = ['http://localhost:5173']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/v1/feed')
def fetch_feeds(session: Session = Depends(get_session)):
    query = select(Feeds)
    results = session.exec(query).all()

    print(f'results: {results}')

    return results


class FeedSchema(BaseModel):
    name: str
    link: str


@app.post('/v1/feed')
def create_feed(feed: FeedSchema, session: Session = Depends(get_session)):
    new_feed = Feeds(name=feed.name, link=feed.link)
    session.add(new_feed)
    session.commit()

    return JSONResponse(status_code=200, content='ok')


@app.get('/v1/feed/{feed_id}')
def fetch_feed(feed_id: str, session: Session = Depends(get_session)):
    try:
        result = session.get(Feeds, feed_id)

        if result is None:
            return JSONResponse(
                status_code=404, content=f'Feed with id {feed_id} was not found'
            )

        data = feedparser.parse(result.link)
        content = construct_feed(data, result)

        response = {'item': result, 'content': content}

        return response
    except Exception as e:
        print('An error occurred in the fetch_feed controller: ', e)
        return JSONResponse(status_code=500, content='Something went wrong')
