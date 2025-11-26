import requests
from datetime import datetime

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

def parse_devpost_date_start(date_str):
    months = {
        "Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6,
        "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12
    }

    parts = date_str.replace(",", "").split()

    if len(parts) == 2:
        # Example: "Oct 31"
        month, day = parts
        return month, int(day), None

    elif len(parts) == 3:
        # Example: "Dec 05 2025"
        month, day, year = parts
        return month, int(day), int(year)

    return None, None, None

def parse_devpost_date_end(date_str):
    months = {
        "Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6,
        "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12
    }

    parts = date_str.replace(",", "").split()

    if len(parts) == 2:
        # Example: "Oct 31"
        day, year = parts
        return None, int(day), int(year)

    elif len(parts) == 3:
        # Example: "Dec 05 2025"
        month, day, year = parts
        return month, int(day), int(year)

    return None, None, None


def format_datetime(month, day, year):
    """Convert parsed date into 'YYYY-MM-DD 00:00:00'."""
    if year is None:
        year = datetime.now().year  # fallback

    dt = datetime(year, month, day, 0, 0, 0)
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def fetch_devpost_filtered_events():
    api_url = "https://devpost.com/api/hackathons?page=1&per_page=20"
    response = requests.get(api_url, timeout=10)
    response.raise_for_status()

    data = response.json()

    events = []

    for h in data.get("hackathons", []):
        title = h.get("title", "No title")
        date_range = h.get("submission_period_dates", "")
        if " - " in date_range:
            start_raw, end_raw = date_range.split(" - ", 1)
        else:
            start_raw = end_raw = ""

        # Parse start
        sm, sd, sy = parse_devpost_date_start(start_raw.strip())

        # Parse end
        em, ed, ey = parse_devpost_date_end(end_raw.strip())

        # If end contains year but start doesn't → use end year
        if sy is None and ey is not None:
            sy = ey
        if em is None:
            em = sm

        # Convert names to int months
        sm = datetime.strptime(sm, "%b").month if sm else None
        em = datetime.strptime(em, "%b").month if em else None

        # Convert to Kaggle format
        start_date = format_datetime(sm, sd, sy) if sm else "1970-01-01 00:00:00"
        end_date = format_datetime(em, ed, ey) if em else "1970-01-01 00:00:00"

        # Themes → description
        themes = h.get("themes", [])
        description = ", ".join([t["name"] for t in themes]) if themes else "No themes"

        events.append({
            "title": title,
            "startDate": start_date,
            "submissionsDeadline": end_date,
            "description": description,
            "id": h.get("url", "No URL"),
        })

    return events


# Test
if __name__ == "__main__":
    events = fetch_devpost_filtered_events()
    for e in events:
        print(e)
