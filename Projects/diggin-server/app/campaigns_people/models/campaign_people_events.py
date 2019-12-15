from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class CampaignPeopleEvent(BaseModel):
    campaign = models.ForeignKey(
        "CampaignPeople", related_name="campaign", on_delete=models.PROTECT)
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "campaign_people_event"
        ordering = ["-created_at"]

    @staticmethod
    def create_event(data: dict, campaign: str):
        return CampaignPeopleEvent.objects.create(data=data, campaign=campaign)
