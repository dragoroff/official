from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class CampaignCompanyData(BaseModel):
    data = JSONField(null=False, default=dict)
    campaign = models.ForeignKey(
        'CampaignCompany', related_name='campaigns', on_delete=models.PROTECT)

    class Meta:
        db_table = "campaign_company_data"

    @staticmethod
    def add_data(campaign: str, data: dict):
        return CampaignCompanyData.objects.create(data=data, campaign=campaign)
