import json

json_file_path = [
    "app/seeds/post_like_seed_data/01-post-like.json",
    "app/seeds/post_like_seed_data/02-post-like.json",
    "app/seeds/post_like_seed_data/03-post-like.json",
    "app/seeds/post_like_seed_data/04-post-like.json",
    "app/seeds/post_like_seed_data/05-post-like.json",
    "app/seeds/post_like_seed_data/06-post-like.json",
    "app/seeds/post_like_seed_data/07-post-like.json",
    "app/seeds/post_like_seed_data/08-post-like.json",
    "app/seeds/post_like_seed_data/09-post-like.json",
    "app/seeds/post_like_seed_data/10-post-like.json",
    "app/seeds/post_like_seed_data/11-post-like.json",
    "app/seeds/post_like_seed_data/12-post-like.json",
    "app/seeds/post_like_seed_data/13-post-like.json",
    "app/seeds/post_like_seed_data/14-post-like.json",
    "app/seeds/post_like_seed_data/15-post-like.json",
    "app/seeds/post_like_seed_data/16-post-like.json",
    "app/seeds/post_like_seed_data/17-post-like.json",
    "app/seeds/post_like_seed_data/18-post-like.json",
    "app/seeds/post_like_seed_data/19-post-like.json",
    "app/seeds/post_like_seed_data/20-post-like.json",
    "app/seeds/post_like_seed_data/21-post-like.json",
    "app/seeds/post_like_seed_data/22-post-like.json",
    "app/seeds/post_like_seed_data/23-post-like.json",
    "app/seeds/post_like_seed_data/24-post-like.json",
    "app/seeds/post_like_seed_data/25-post-like.json",
    "app/seeds/post_like_seed_data/26-post-like.json",
    "app/seeds/post_like_seed_data/27-post-like.json",
    "app/seeds/post_like_seed_data/28-post-like.json",
    "app/seeds/post_like_seed_data/29-post-like.json",
    "app/seeds/post_like_seed_data/30-post-like.json",
    "app/seeds/post_like_seed_data/31-post-like.json",
    "app/seeds/post_like_seed_data/32-post-like.json",
    "app/seeds/post_like_seed_data/33-post-like.json",
    "app/seeds/post_like_seed_data/34-post-like.json",
    "app/seeds/post_like_seed_data/35-post-like.json",
    "app/seeds/post_like_seed_data/36-post-like.json",
    "app/seeds/post_like_seed_data/37-post-like.json",
    "app/seeds/post_like_seed_data/38-post-like.json",
    "app/seeds/post_like_seed_data/39-post-like.json",
    "app/seeds/post_like_seed_data/40-post-like.json",
    "app/seeds/post_like_seed_data/41-post-like.json",
    "app/seeds/post_like_seed_data/42-post-like.json",
    "app/seeds/post_like_seed_data/43-post-like.json",
    "app/seeds/post_like_seed_data/44-post-like.json",
    "app/seeds/post_like_seed_data/45-post-like.json",
    "app/seeds/post_like_seed_data/46-post-like.json",
    "app/seeds/post_like_seed_data/47-post-like.json",
    "app/seeds/post_like_seed_data/48-post-like.json",
    "app/seeds/post_like_seed_data/49-post-like.json",
    "app/seeds/post_like_seed_data/50-post-like.json",
]
post_like_seed_data = []

for x in json_file_path:
    file = open(x)
    data = json.load(file)
    
    for y in data:
        post_like_seed_data.append(y)
        
        
        
