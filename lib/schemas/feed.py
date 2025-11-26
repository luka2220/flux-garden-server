from pydantic import BaseModel


class FeedSchema(BaseModel):
    name: str
    link: str
