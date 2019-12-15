from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class CampaignPeopleData(BaseModel):
    data = JSONField(null=False, default=dict)
    campaign = models.ForeignKey(
        'CampaignPeople', related_name='campaigns', on_delete=models.PROTECT)

    class Meta:
        db_table = "campaign_people_data"

    @staticmethod
    def add_data(campaign: str, data: dict):
        return CampaignPeopleData.objects.create(data=data, campaign=campaign)
