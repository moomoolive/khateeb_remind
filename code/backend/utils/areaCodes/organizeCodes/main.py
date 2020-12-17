import l_list
#import b_tree
import json

with open("codes.json") as f:
    area_codes_json = json.load(f)

area_codes = []
for code in area_codes_json:
    x = int(code['code'])
    area_codes.append(x)

ll = l_list.linked_list()

ll.create(area_codes)


def get_middle(upperbound, lowerbound):
    diff = upperbound - lowerbound
    middle = lowerbound + round(diff/2)
    return middle

def updateTree(index):
    val = ll.get_index(index)
    print(f'value: {val}', end=" ")
    #update tree

upperbound = ll.count
lowerbound = 0

count = 0
def populate_tree(upperbound, lowerbound):
    global count
    diff = round((upperbound - lowerbound)/2)
    middle = lowerbound + diff
    updateTree(middle)
    print(f"upper: {upperbound}, lower: {lowerbound}, middle: {middle}, diff: {diff}")
    if diff >= 2:
        right = populate_tree(upperbound, middle)
        left = populate_tree(middle, lowerbound)
    count += 1


populate_tree(upperbound, lowerbound)

print(f'Populate Tree was called {count}  times')