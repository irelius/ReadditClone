import json

json_file_path = [
    'app/seeds/post_seed_data/01-ephemeral.json',
    'app/seeds/post_seed_data/02-gloomscape.json',
    'app/seeds/post_seed_data/03-futurefashionfail.json',
    'app/seeds/post_seed_data/04-accidentaltimetravel.json',
    'app/seeds/post_seed_data/05-programming.json',
    'app/seeds/post_seed_data/06-technology.json',
    'app/seeds/post_seed_data/07-fitness.json',
    'app/seeds/post_seed_data/08-gaming.json',
    'app/seeds/post_seed_data/09-music.json',
    'app/seeds/post_seed_data/10-movies.json',
    'app/seeds/post_seed_data/11-books.json',
    'app/seeds/post_seed_data/12-food.json',
    'app/seeds/post_seed_data/13-travel.json',
    'app/seeds/post_seed_data/14-art.json',
]
post_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        post_seed_data.append(y)