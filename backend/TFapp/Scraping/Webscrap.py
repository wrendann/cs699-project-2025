import json
from datetime import datetime
from kaggle.api.kaggle_api_extended import KaggleApi

# Try to use Django timezone utilities when running inside the project.
# If Django isn't available (running this file standalone), fall back to UTC.
try:
    from django.utils import timezone as dj_timezone
    DJANGO_TZ_AVAILABLE = True
except Exception:
    dj_timezone = None
    DJANGO_TZ_AVAILABLE = False
    from datetime import timezone as _dt_timezone


def ensure_timezone_aware(dt):
    if dt is None:
        return None
    # parse ISO strings
    if isinstance(dt, str):
        try:
            dt = datetime.fromisoformat(dt)
        except Exception:
            return dt
    # if it's a datetime, make it aware if naive
    if isinstance(dt, datetime):
        if dt.tzinfo is None:
            if DJANGO_TZ_AVAILABLE:
                return dj_timezone.make_aware(dt, dj_timezone.get_default_timezone())
            # fallback to UTC
            return dt.replace(tzinfo=_dt_timezone.utc)
        return dt
    return dt


def Confirmation():
    print("Added events to database")

def fetch_kaggle_events(max_pages=2):
    """
    Fetch Kaggle competitions (treated as events)
    and return a list of event dictionaries.
    """
    api = KaggleApi()
    api.authenticate()

    all_events = []
    for page in range(1, max_pages + 1):
        competitions = api.competitions_list(sort_by='latestDeadline', page=page)
        
        for comp in competitions:
            #print(dir(comp))
            # Keep the original datetime objects from Kaggle's API instead
            # of converting them to strings. We'll make them timezone-aware
            # later (in the scheduler) if needed. Keeping them as datetimes
            # makes it easier to inspect and convert correctly.
            event = {
                "id": comp.ref,
                "title": comp.title,
                #"organization": comp.organizationName,
                "description": comp.description,
                #"reward": comp.reward,
                #"category": comp.category,
                "startDate": comp.enabled_date,
                "submissionsDeadline": comp.deadline,
                #"hostSegment": comp.hostSegmentTitle,
                #"isPrivate": comp.isPrivate,
                #"enabledDate": comp.enabledDate,
                #"maxTeamSize": comp.maxTeamSize,
                #"userHasEntered": comp.userHasEntered
            }
            all_events.append(event)
    return all_events


def save_to_json(events, filename="kaggle_events.json"):
    """Save event data to a JSON file."""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=4, ensure_ascii=False)
    print(f"Saved {len(events)} events to {filename}")


if __name__ == "__main__":
    print("Fetching Kaggle competitions as events...")
    events = fetch_kaggle_events(max_pages=3)   # increase pages if you want more results
    save_to_json(events)
    print("Done")
