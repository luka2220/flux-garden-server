import uuid
from datetime import datetime

from sqlmodel import Field, Relationship, Session, SQLModel, create_engine


class UserFeeds(SQLModel, table=True):
    """
    Model of table link for Users and subscribed Feeds
    """

    user_id: str = Field(foreign_key='users.id', primary_key=True)
    feed_id: str = Field(foreign_key='feeds.id', primary_key=True)

    subscribed_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class Users(SQLModel, table=True):
    """
    Model representing a user
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str
    name: str
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

    feeds: list[Feeds] = Relationship(back_populates='users', link_model=UserFeeds)


class Feeds(SQLModel, table=True):
    """
    Model for the Feed table
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    link: str
    createdAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.now().isoformat())

    users: list[Users] = Relationship(back_populates='feeds', link_model=UserFeeds)


sqlite_file_name = 'db.sqlite'
sqlite_url = f'sqlite:///{sqlite_file_name}'

engine = create_engine(sqlite_url, echo=True)


def initalize_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
