import binarytree
import json
import time

class Node(binarytree.Node):
    def __init__(self, val):
        super().__init__(val)
        self.json_node = {
            "val": None,
            "left": None,
            "right": None
        }
        self.empty_json_node = {
            "val": None,
            "left": None,
            "right": None
        }

    def insert(self, val):
        if self.val:
            if val < self.val:
                if self.left is None:
                    self.left = Node(val)
                else:
                    self.left.insert(val)
            elif val > self.val:
                if self.right is None:
                    self.right = Node(val)
                else:
                    self.right.insert(val)
        else:
            self.val = val
    
    def json_build(self, node=None):
        x = self.json_node if node is None else node
        x['val'] = self.val
        if self.left:
            x['left'] = self.empty_json_node.copy()
            self.left.json_build(x['left'])
        if self.right:
            x['right'] = self.empty_json_node.copy()
            self.right.json_build(x['right'])
    
    def json_out(self, filename="../area_codes_tree.json"):
        with open(filename, 'w') as f:
            json.dump(self.json_node, f)

    def json(self):
        self.json_build()
        self.json_out()