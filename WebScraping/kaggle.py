import json
from datetime import datetime
from kaggle.api.kaggle_api_extended import KaggleApi

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
            event = {
                "id": comp.ref,
                "title": comp.title,
                #"organization": comp.organizationName,
                "description" : comp.description,
                #"reward": comp.reward,
                #"category": comp.category,
                "startDate": str(comp.enabled_date),
                "submissionsDeadline": str(comp.deadline),
                #"hostSegment": comp.hostSegmentTitle,
                #"isPrivate": comp.isPrivate,
                #"enabledDate": str(comp.enabledDate),
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
