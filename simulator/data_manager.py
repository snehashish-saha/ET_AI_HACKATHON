import json
import os


class LiveDataManager:

    def __init__(self, filename="data/live_data.json"):

        self.filename = filename

        os.makedirs(os.path.dirname(filename), exist_ok=True)

    def save(self, data):

        with open(self.filename, "w") as f:

            json.dump(data, f, indent=4)