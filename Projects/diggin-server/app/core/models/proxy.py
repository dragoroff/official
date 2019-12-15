from app.base_model import BaseModel, models

PROXY_STATUS_NEW = "NEW"
PROXY_STATUS_INUSE = "INUSE"
PROXY_STATUS_BLOCKED = "BLOCKED"
PROXY_STATUS_DEAD = "DEAD"
PROXY_STATUSES = [
    (PROXY_STATUS_NEW, "NEW"),
    (PROXY_STATUS_INUSE, "INUSE"),
    (PROXY_STATUS_BLOCKED, "BLOCKED"),
    (PROXY_STATUS_DEAD, "DEAD"),
]


class Proxy(BaseModel):
    ip = models.CharField(max_length=32, null=False, db_index=True)
    port = models.CharField(max_length=8, null=False)
    location = models.CharField(max_length=64, null=False)
    status = models.CharField(null=False, max_length=32, choices=PROXY_STATUSES)

    def __str__(self):
        return f"{self.ip}:{self.port}"

    class Meta:
        db_table = "proxy"
