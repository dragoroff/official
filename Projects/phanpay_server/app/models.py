from django.db import models
from django.contrib.postgres.fields import JSONField


class Events(models.Model):
    id = models.AutoField(primary_key=True)
    entityID = models.CharField(max_length=16, blank=True, null=True)
    event_type = models.CharField(max_length=64, null=False)
    data = JSONField(default=dict, null=False)
    created_at = models.DateTimeField(auto_now=True, db_index=True)


    class Meta:
        db_table = "events"
