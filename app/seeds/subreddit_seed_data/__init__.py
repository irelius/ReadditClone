import json

json_file_path = [
    'app/seeds/subreddit_seed_data/01-subreddit.json'
]
subreddit_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        subreddit_seed_data.append(y)