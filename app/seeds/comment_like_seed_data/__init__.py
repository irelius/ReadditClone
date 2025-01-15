import json

json_file_path = [
    'app/seeds/comment_like_seed_data/01-comment-like.json',
    'app/seeds/comment_like_seed_data/02-comment-like.json',
    'app/seeds/comment_like_seed_data/03-comment-like.json',
    'app/seeds/comment_like_seed_data/10-comment-like.json',
    'app/seeds/comment_like_seed_data/11-comment-like.json',
    'app/seeds/comment_like_seed_data/12-comment-like.json',
]
comment_like_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        comment_like_seed_data.append(y)
        