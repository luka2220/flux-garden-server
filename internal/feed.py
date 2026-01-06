from dataclasses import dataclass

from models.feed import Feeds


@dataclass
class CleanedFeed:
    title: str
    description: str
    link: str
    lastBuildDate: str
    feedUrl: str
    image: FeedPostImage
    items: list[FeedPost]


@dataclass
class FeedPostImage:
    link: str
    title: str
    url: str


@dataclass
class FeedPost:
    title: str
    author: str
    summary: str
    link: str
    published: str
    content: str | None
    tags: list[str]


def construct_feed(content: dict, feed: Feeds) -> CleanedFeed:
    clean_feed = CleanedFeed(
        title=getattr(content.feed, 'title', feed.name),
        description=getattr(content.feed, 'subtitle', 'No description'),
        link=getattr(content.feed, 'link', feed.link),
        lastBuildDate=getattr(content.feed, 'updated', 'No last build'),
        feedUrl=feed.link,
        image=FeedPostImage(
            link=getattr(content.feed.image, 'href', 'No image url'),
            title=getattr(content.feed.image, 'title', 'Image title'),
            url=getattr(content.feed.image, 'href', 'No image link'),
        ),
        items=[
            FeedPost(
                title=getattr(post, 'title'),
                author=getattr(post, 'author'),
                summary=getattr(post, 'summary'),
                link=getattr(post, 'link'),
                published=getattr(post, 'published'),
                content=getattr(post.content[0], 'value'),
                tags=[tag.term for tag in getattr(post, 'tags')],
            )
            for post in getattr(content, 'entries')
        ],
    )

    return clean_feed
