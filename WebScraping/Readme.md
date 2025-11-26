# Kaggle Events

This folder contains 2 Python scripts that fetches Kaggle and DevPost competitions and stores them as event data in a JSON file.

# Files
- `kaggle.py` – Python script that connects to the Kaggle API, retrieves competitions, and saves them in JSON format.
- `DevPost.py` - Python script that receives competitions from Devpost and saves them in JSON format
- `kaggle_events.json` – Output file containing the fetched event data.

# How It Works
The script:
1. Authenticates with the Kaggle API.
2. Fetches competitions page-by-page.
3. Extracts selected fields such as title, reward, category, deadline, and description.
4. Saves all results into `kaggle_events.json`.

# Requirements
- Python 3.x  
- Kaggle API and beautifulSoup installed:
  ```bash
  pip install kaggle
  pip install beautifulsoup4
  ```
# Setup Instructions(Locally update kaggle_events.json and Devpost.json)
1. Clone this repository
```
git clone https://github.com/wrendann/cs699-project-2025.git
```

2. Move into the WebScraping folder
```
cd cs699-project-2025/WebScraping
```

3. Install required Python packages
```
pip install kaggle
```

4. Add your Kaggle API token

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

5. Run the scripts
```
python kaggle.py
python DevpostScrap.py
```


This will generate or update both the files
