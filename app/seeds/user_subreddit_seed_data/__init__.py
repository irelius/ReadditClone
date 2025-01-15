import json

json_file_path = [
    'app/seeds/user_subreddit_seed_data/01-user-subreddit.json',
    'app/seeds/user_subreddit_seed_data/02-user-subreddit.json',
    'app/seeds/user_subreddit_seed_data/03-user-subreddit.json',
    'app/seeds/user_subreddit_seed_data/04-user-subreddit.json'
]
user_subreddit_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        user_subreddit_seed_data.append(y)