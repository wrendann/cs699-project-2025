# Kaggle Events Fetcher

This folder contains a Python script that fetches Kaggle competitions and stores them as event data in a JSON file.

# Files
- `kaggle.py` – Python script that connects to the Kaggle API, retrieves competitions, and saves them in JSON format.
- `kaggle_events.json` – Output file containing the fetched event data.

# How It Works
The script:
1. Authenticates with the Kaggle API.
2. Fetches competitions page-by-page.
3. Extracts selected fields such as title, reward, category, deadline, and description.
4. Saves all results into `kaggle_events.json`.

# Requirements
- Python 3.x  
- Kaggle API installed:
  ```bash
  pip install kaggle
  ```
# Setup Instructions(Locally update kaggle_events.json)
1. Clone this repository
```
git clone https://github.com/wrendann/cs699-project-2025.git
```

3. Move into the backend folder
```
cd cs699-project-2025/WebScraping
```

5. Install required Python packages
```
pip install kaggle
```

7. Add your Kaggle API token

Place your downloaded kaggle.json file into:
```
~/.kaggle/kaggle.json
```

If the folder does not exist, create it:

```
mkdir ~/.kaggle
cp /path/to/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

5. Run the script
```
python kaggle.py
```


This will generate or update:
```
kaggle_events.json
```
