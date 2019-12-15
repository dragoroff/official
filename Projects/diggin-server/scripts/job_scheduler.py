import schedule
import time

time_delay = 30


def job_check():
    from app.models import Job, JOB_STATUS_NEW
    from datetime import datetime

    new_jobs = Job.objects.filter(status=JOB_STATUS_NEW)
    if new_jobs:
        for job in new_jobs:
            if job.scheduled_to < datetime.now():
                job.enqueue()
            else:
                continue


schedule.every(time_delay).minutes.do(job_check)

while True:
    schedule.run_pending()
    time.sleep(time_delay)
