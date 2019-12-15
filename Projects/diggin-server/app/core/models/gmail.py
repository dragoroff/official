from app.base_model import BaseModel, models

EMAIL_STATUS_NEW = "NEW"
EMAIL_STATUS_PASSCHANGED = "PASSCHANGED"
EMAIL_STATUS_INUSE = "INUSE"
EMAIL_STATUS_BLOCKED = "BLOCKED"
EMAIL_STATUS_DEAD = "DEAD"
EMAIL_STATUSES = [
    (EMAIL_STATUS_NEW, "NEW"),
    (EMAIL_STATUS_PASSCHANGED, "PASSCHANGED"),
    (EMAIL_STATUS_INUSE, "INUSE"),
    (EMAIL_STATUS_BLOCKED, "BLOCKED"),
    (EMAIL_STATUS_DEAD, "DEAD"),
]


class Gmail(BaseModel):
    email = models.CharField(max_length=64, null=False, db_index=True)
    password = models.CharField(max_length=64, null=False)
    phone = models.CharField(max_length=64, null=False)
    recovery_email = models.CharField(max_length=64, null=False)
    status = models.CharField(
        null=False, max_length=32, choices=EMAIL_STATUSES)

    def __str__(self):
        return self.email

    class Meta:
        db_table = "gmail"
