from subprocess import check_call, check_output
from app import settings


def run_driver(job):
    try:
        out = check_call([
            "node",
            settings.DRIVER_MAIN_MODULE,
            "--job",
            job
        ])
        print("### OFFLINE PROCESS")
        print(out)
    except Exception as e:
        print("### ERROR")
        print(str(e))
