from enum import Enum

from pydantic import BaseModel
from sqlmodel import Session

from models.feed import Feeds, UserFeeds, Users


class ValidTables(Enum):
    User = Users
    UserFeed = UserFeeds
    Feed = Feeds


class RecordToCheck(BaseModel):
    pk: str
    sk: str | None
    table_name: ValidTables


def doesRecordExist(record: RecordToCheck, session: Session) -> bool:
    """
    Checks if a db record exists from the givien id and table
    """
    match record.table_name:
        case ValidTables.User:
            result = session.get(Users, record.pk)
            return False if result is None else True
        case ValidTables.UserFeed:
            if record.sk is None:
                raise ValueError('SK cannot be None here')
            result = session.get(UserFeeds, (record.pk, record.sk))
            return False if result is None else True
        case ValidTables.Feed:
            result = session.get(Feeds, record.pk)
            return False if result is None else True
