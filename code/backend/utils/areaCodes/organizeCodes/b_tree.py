class Node:
    def __init__(self, data):
        self.right = None
        self.left = None
        self.data = data
    
    def print(self, print_option='\n'):
        print(self.data, end=print_option)
        if self.left:
            self.left.print(' ')
        else:
            print(f"{'None' : <10}", end=" ")
        if self.right:
            self.right.print("\n")
        else:
            print(f"{'None' : >10}")

    def insert(self, data):
        if self.data:
            if data < self.data:
                if self.left is None:
                    self.left = Node(data)
                else:
                    self.left.insert(data)
            elif data > self.data:
                if self.right is None:
                    self.right = Node(data)
                else:
                    self.right.insert(data)
        else:
            self.data = data

root = Node(10)
root.insert(6)
root.insert(12)
root.insert(14)

root.print()