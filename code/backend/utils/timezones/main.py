import json

with open('source.json', 'r') as f:
    timezones = json.load(f)

timezone_hashmap = dict.fromkeys(timezones, True)

with open('../IANNA-TZs.json', 'w') as f: 
    json.dump(timezone_hashmap, f)