import l_list
import b_tree
import json

with open("codes.json") as f:
    area_codes_json = json.load(f)

area_codes = []
for code in area_codes_json:
    x = int(code['code'])
    area_codes.append(x)

ll = l_list.linked_list()
ll.create(area_codes)
ll.delete_duplicates()
tree = b_tree.Node(0)

def get_middle(upperbound, lowerbound):
    diff = upperbound - lowerbound
    middle = lowerbound + round(diff/2)
    return middle

def updateTree(index):
    val = ll.get_index(index)
    tree.insert(val)

def populate_tree(upperbound, lowerbound):
    diff = round((upperbound - lowerbound)/2)
    middle = lowerbound + diff
    if diff >= 1:
        updateTree(middle)
        right = populate_tree(upperbound, middle)
        left = populate_tree(middle, lowerbound)

upperbound = ll.length()
lowerbound = -1
populate_tree(upperbound, lowerbound)
tree.json()

print(tree.json_node)
print(tree)