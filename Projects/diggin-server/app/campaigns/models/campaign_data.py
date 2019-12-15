from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField

CAMPAIGN_TYPE_COMPANIES = "COMPANIES"
CAMPAIGN_TYPE_GROUPS = "GROUPS"
CAMPAIGN_TYPE_PEOPLE = "PEOPLE"

CAMPAIGN_TYPES = [
    (CAMPAIGN_TYPE_COMPANIES, "company"),
    (CAMPAIGN_TYPE_GROUPS, "groups"),
    (CAMPAIGN_TYPE_PEOPLE, "people")
]


class CampaignData(BaseModel):
    data = JSONField(null=False, default=dict)
    campaign = models.ForeignKey(
        'Campaign', related_name='camp', on_delete=models.PROTECT)
    type_data = models.CharField(max_length=128, choices=CAMPAIGN_TYPES)

    class Meta:
        db_table = "campaign_data"

    @staticmethod
    def add_data(campaign: str, data: dict, type_data: str):
        return CampaignData.objects.create(
            data=data, campaign=campaign, type_data=type_data)
