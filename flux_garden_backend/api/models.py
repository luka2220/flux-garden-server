from django.db import models
import uuid


class Feed(models.Model):
    """
    Model representing feed data from the DB
    """

    createdAt = models.DateTimeField(auto_now=True)
    updatedAt = models.DateTimeField(auto_now=True)
    name = models.CharField(blank=False)
    link = models.CharField(blank=False)
    id = models.CharField(primary_key=True, blank=False, default=uuid.uuid4, editable=False)

    class Meta:
        ordering = ["createdAt"]  # Order by createdAt field when fetching from the db
