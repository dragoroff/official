from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class CampaignPeopleDataEvent(BaseModel):
    campaign = models.ForeignKey("CampaignPeopleData", related_name="campaign_events", on_delete=models.PROTECT)
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "campaign_people_data_event"
        ordering = ["-created_at"]
