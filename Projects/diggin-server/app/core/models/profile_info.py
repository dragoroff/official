from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class ProfileInfo(BaseModel):
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "profile_info"

    def create_info(data: dict):
        ProfileInfo.objects.create(data=data)
