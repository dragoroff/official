from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class CampaignEvent(BaseModel):
    campaign = models.ForeignKey(
        "Campaign", related_name="campaign", on_delete=models.PROTECT)
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "campaign_event"
        ordering = ["-created_at"]

    @staticmethod
    def create_event(data: dict, campaign: str):
        return CampaignEvent.objects.create(data=data, campaign=campaign)
