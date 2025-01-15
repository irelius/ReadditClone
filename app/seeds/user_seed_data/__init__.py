import json

json_file_path = [
    'app/seeds/user_seed_data/01-user.json'
]
user_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        user_seed_data.append(y)