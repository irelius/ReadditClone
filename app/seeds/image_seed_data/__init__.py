import json

json_file_path = [
    'app/seeds/image_seed_data/02-image.json',
    'app/seeds/image_seed_data/04-image.json',
    'app/seeds/image_seed_data/05-image.json'
]
image_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        image_seed_data.append(y)