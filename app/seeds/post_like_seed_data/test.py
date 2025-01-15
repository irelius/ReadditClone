data = [
    {
        "like_status": "like",
        "post_id": 17,
        "user_id": 3
    },
    {
        "like_status": "like",
        "post_id": 18,
        "user_id": 4
    },
    {
        "like_status": "like",
        "post_id": 19,
        "user_id": 2
    },
    {
        "like_status": "like",
        "post_id": 20,
        "user_id": 2
    },
    {
        "like_status": "like",
        "post_id": 21,
        "user_id": 3
    },
    {
        "like_status": "like",
        "post_id": 22,
        "user_id": 2
    },
    {
        "like_status": "like",
        "post_id": 23,
        "user_id": 9
    },
    {
        "like_status": "like",
        "post_id": 24,
        "user_id": 10
    },
    {
        "like_status": "like",
        "post_id": 25,
        "user_id": 9
    },
    {
        "like_status": "like",
        "post_id": 26,
        "user_id": 10
    },
    {
        "like_status": "like",
        "post_id": 27,
        "user_id": 1
    },
    {
        "like_status": "like",
        "post_id": 28,
        "user_id": 11
    },
    {
        "like_status": "like",
        "post_id": 29,
        "user_id": 1
    },
    {
        "like_status": "like",
        "post_id": 30,
        "user_id": 11
    },
    {
        "like_status": "like",
        "post_id": 31,
        "user_id": 4
    },
    {
        "like_status": "like",
        "post_id": 32,
        "user_id": 4
    },
    {
        "like_status": "like",
        "post_id": 33,
        "user_id": 6
    },
    {
        "like_status": "like",
        "post_id": 34,
        "user_id": 6
    },
    {
        "like_status": "like",
        "post_id": 35,
        "user_id": 2
    },
    {
        "like_status": "like",
        "post_id": 36,
        "user_id": 9
    },
    {
        "like_status": "like",
        "post_id": 37,
        "user_id": 10
    },
    {
        "like_status": "like",
        "post_id": 38,
        "user_id": 10
    },
    {
        "like_status": "like",
        "post_id": 39,
        "user_id": 7
    },
    {
        "like_status": "like",
        "post_id": 40,
        "user_id": 7
    },
    {
        "like_status": "like",
        "post_id": 41,
        "user_id": 3
    },
    {
        "like_status": "like",
        "post_id": 42,
        "user_id": 3
    },
    {
        "like_status": "like",
        "post_id": 43,
        "user_id": 6
    },
    {
        "like_status": "like",
        "post_id": 44,
        "user_id": 8
    },
    {
        "like_status": "like",
        "post_id": 45,
        "user_id": 8
    },
    {
        "like_status": "like",
        "post_id": 46,
        "user_id": 1
    },
    {
        "like_status": "like",
        "post_id": 47,
        "user_id": 6
    },
    {
        "like_status": "like",
        "post_id": 48,
        "user_id": 6
    },
    {
        "like_status": "like",
        "post_id": 49,
        "user_id": 4
    },
    {
        "like_status": "like",
        "post_id": 50,
        "user_id": 4
    }
]

for x in data:
    id = x["post_id"]
    f = open(f"{id}-post-like.json", "a")

    f.write(f"[{x}]")
    f.close()