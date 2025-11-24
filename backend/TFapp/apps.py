from django.apps import AppConfig
import os
import logging


class TfappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'TFapp'

    def ready(self):
        """Start the background scheduler when the Django process starts.

        We guard with the RUN_MAIN environment variable so the scheduler isn't
        started twice when the development autoreloader is active.
        """
    # Only start scheduler in the autoreloader's child/main process.
    # When using `runserver`, Django sets RUN_MAIN='true' in the process
    # that should run background tasks; this avoids starting the scheduler
    # twice (once in the parent process and once in the child).
    if os.environ.get('RUN_MAIN') == 'true':
        try:
            # Import here to avoid side-effects at import time
            from .scheduler import start_scheduler

            start_scheduler()
        except Exception:
            logging.exception("Failed to start TFapp scheduler")
