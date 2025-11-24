import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django.utils import timezone
from django.db import transaction

logger = logging.getLogger(__name__)

# Module-level scheduler reference so we only start once
_scheduler = None


def scrape_events_placeholder():
    """Placeholder scraping job.

    Replace the body of this function with real scraping logic. For now it
    creates a simple Event entry so you can see the periodic job working.
    """
    logger.info("Running scrape_events_placeholder job")
    try:
        # Local import to avoid import-time model access before Django is ready
        from .models import Event
        name = f"Scraped Event {timezone.now().isoformat()}"
        with transaction.atomic():
            Event.objects.create(
                name=name,
                description="Placeholder event created by scraper",
                start_date=timezone.now(),
                end_date=timezone.now(),
                location="Online",
            )
        logger.info("Created placeholder event: %s", name)
    except Exception:
        logger.exception("Error while running scrape_events_placeholder")


def start_scheduler():
    """Start the background scheduler and schedule the scraping job.

    This is safe to call multiple times; it will only start a single
    scheduler instance.
    """
    global _scheduler
    if _scheduler is not None:
        logger.debug("Scheduler already running")
        return

    logger.info("Starting background scheduler for TFapp jobs")
    _scheduler = BackgroundScheduler()

    # Run every 60 minutes by default. Adjust the interval as needed.
    _scheduler.add_job(
        scrape_events_placeholder,
        trigger=IntervalTrigger(seconds=10),
        id="tfapp.scrape_events",
        replace_existing=True,
        max_instances=1,
    )

    _scheduler.start()
    logger.info("Scheduler started with job 'tfapp.scrape_events' (interval: 60m)")
