from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class CampaignCompanyDataEvent(BaseModel):
    campaign = models.ForeignKey("CampaignCompanyData", related_name="campaign_events", on_delete=models.PROTECT)
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "campaign_company_data_event"
        ordering = ["-created_at"]
