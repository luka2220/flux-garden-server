import logging
import ssl
from contextlib import asynccontextmanager
from typing import Annotated

import certifi
import feedparser
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from internal.feed import construct_feed
from internal.queries import RecordToCheck, ValidTables, doesRecordExist
from models.feed import Feeds, UserFeeds, Users, get_session, initalize_db

ssl._create_default_https_context = lambda: ssl.create_default_context(
    cafile=certifi.where()
)


logging.basicConfig(
    level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
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
def fetch_feeds(session: Annotated[Session, Depends(get_session)]):
    query = select(Feeds)
    results = session.exec(query).all()

    print(f'results: {results}')

    return results


class FeedSchema(BaseModel):
    name: str
    link: str


@app.post('/v1/feed')
def create_feed(feed: FeedSchema, session: Annotated[Session, Depends(get_session)]):
    new_feed = Feeds(name=feed.name, link=feed.link)
    session.add(new_feed)
    session.commit()

    return JSONResponse(status_code=200, content='ok')


@app.get('/v1/feed/{feed_id}')
def fetch_feed(feed_id: str, session: Annotated[Session, Depends(get_session)]):
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


class UserSignupSchema(BaseModel):
    email: str
    name: str


@app.post('/v1/auth/signup')
def user_signup(
    user: UserSignupSchema,
    session: Annotated[Session, Depends(get_session)],
):
    stmt = select(Users).where(Users.email == user.email)
    user_result = session.exec(stmt).first()
    if user_result is not None:
        raise HTTPException(
            status_code=400, detail='User with that email already exists'
        )

    new_user = Users(email=user.email, name=user.name)
    session.add(new_user)
    session.commit()

    return 200


class FeedSubscriptionSchema(BaseModel):
    feed_id: str
    user_id: str


@app.post('/v1/feed/subscribe')
def feed_subscribe(
    feed_subscription: FeedSubscriptionSchema,
    session: Annotated[Session, Depends(get_session)],
):
    feed_id, user_id = feed_subscription.feed_id, feed_subscription.user_id
    record_data = RecordToCheck(pk=user_id, sk=feed_id, table_name=ValidTables.UserFeed)
    if doesRecordExist(record_data, session):
        return JSONResponse(
            status_code=400,
            content={
                'message': f'User with id {user_id} is already subscribed to feed with id {feed_id}'
            },
        )

    new_subscription = UserFeeds(user_id=user_id, feed_id=feed_id)
    session.add(new_subscription)
    session.commit()

    return 200
