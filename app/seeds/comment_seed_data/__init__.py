import json

json_file_path = [
    "app/seeds/comment_seed_data/01-comment.json",
    "app/seeds/comment_seed_data/02-comment.json",
    "app/seeds/comment_seed_data/03-comment.json",
    "app/seeds/comment_seed_data/04-comment.json",
    "app/seeds/comment_seed_data/05-comment.json",
    "app/seeds/comment_seed_data/06-comment.json",
    "app/seeds/comment_seed_data/07-comment.json",
    "app/seeds/comment_seed_data/08-comment.json",
    "app/seeds/comment_seed_data/10-comment.json",
    "app/seeds/comment_seed_data/11-comment.json",
    "app/seeds/comment_seed_data/12-comment.json",
    "app/seeds/comment_seed_data/13-comment.json",
    "app/seeds/comment_seed_data/14-comment.json",
    "app/seeds/comment_seed_data/15-comment.json",
    "app/seeds/comment_seed_data/19-comment.json",
    "app/seeds/comment_seed_data/20-comment.json",
    "app/seeds/comment_seed_data/22-comment.json",
    "app/seeds/comment_seed_data/23-comment.json",
    "app/seeds/comment_seed_data/31-comment.json",
    "app/seeds/comment_seed_data/34-comment.json",
    "app/seeds/comment_seed_data/36-comment.json",
    "app/seeds/comment_seed_data/37-comment.json",
    "app/seeds/comment_seed_data/38-comment.json",
    "app/seeds/comment_seed_data/39-comment.json",
    "app/seeds/comment_seed_data/40-comment.json",
    "app/seeds/comment_seed_data/41-comment.json",
    "app/seeds/comment_seed_data/42-comment.json",
    "app/seeds/comment_seed_data/43-comment.json",
    "app/seeds/comment_seed_data/44-comment.json",
    "app/seeds/comment_seed_data/46-comment.json",
    "app/seeds/comment_seed_data/47-comment.json",
    "app/seeds/comment_seed_data/49-comment.json",
    "app/seeds/comment_seed_data/50-comment.json"
]
comment_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        comment_seed_data.append(y)
        
    