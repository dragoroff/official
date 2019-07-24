from django.contrib import admin
from app.models import Events


@admin.register(Events)
class AdminEvents(admin.ModelAdmin):
    list_display = ('id', 'entityID', 'event_type', 'data', 'created_at')
