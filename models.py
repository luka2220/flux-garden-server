from sqlmodel import SQLModel, Field, Session, create_engine
import uuid
from datetime import datetime


class Feed(SQLModel, table=True):
    """
    Model for the Feed table
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    link: str
    createdAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.now().isoformat())


sqlite_file_name = "db.sqlite3"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


def initalize_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
