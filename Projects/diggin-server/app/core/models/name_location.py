from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class SearcherLocation(BaseModel):
    location = models.CharField(max_length=256, unique=True, null=False)
    first_names = JSONField(default=list, null=False)

    class Meta:
        db_table = "searcher_location"
