import json

with open("codes.json") as f:
    area_codes = json.load(f)

area_codes.sort()
area_codes = dict.fromkeys(area_codes, True)

with open("../area_codes.json", 'w') as f:
    json.dump(area_codes, f)