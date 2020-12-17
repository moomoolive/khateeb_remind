import json 

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class linked_list:
    def __init__(self):
        self.head = None
        self.count = 0
    
    def create(self, array_of_vals):
        for index, value in enumerate(array_of_vals):
            new_entry = Node(value)
            if (self.head == None):
                self.head = new_entry
                continue
            first_bigger_than_current = self.head.data > new_entry.data
            if (first_bigger_than_current):
                self.replace_head(new_entry)
                continue
            last_entry = self.head
            while last_entry.next:
                next_bigger_than_current = last_entry.next.data > new_entry.data
                if (next_bigger_than_current):
                    self.insert_node(last_entry, new_entry)
                    break
                last_entry = last_entry.next
            last_entry.next = new_entry
            self.count += 1
    
    def replace_head(self, entry):
        entry.next = self.head
        self.head = entry
    
    def insert_node(self, previous, new):
        new.next = previous.next
        previous.next = new

    def print(self):
        printval = self.head
        while printval is not None:
            print(printval.data, end=" ")
            printval = printval.next
    
    def countN(self):
        print(f'This linked list has: {self.count} nodes')

    def get_index(self, index):
        count = 0
        val = self.head
        while val is not None:
            count += 1
            if (count >= index):
                return val.data
            val = val.next
