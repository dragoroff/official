from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField
from app.models import *


class ProfileInfoCombination(BaseModel):
    skills = JSONField(default=list, null=False)
    summary = models.CharField(max_length=10024, null=False)
    education = JSONField(default=list, null=False)
    experience = JSONField(default=list, null=False)
    last_name = models.CharField(max_length=25, null=False)
    first_name = models.CharField(max_length=25, null=False)
    zip_code = models.CharField(max_length=10, blank=True, null=False)
    is_male = models.BooleanField(null=False, default=False)

    class Meta:
        db_table = "profile_info_combination"

    def __str__(self):
        return f'{self.first_name}_{self.last_name}'

    @staticmethod
    def get_unused_profiles():
        used_profiles_ids = [
            acc.profile_details_id for acc in Account.objects.all()]
        unused_profiles = [prof for prof in ProfileInfoCombination.objects.all(
        ) if prof.id not in used_profiles_ids]
        return unused_profiles
