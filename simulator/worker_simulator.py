import random


class WorkerSimulator:

    def __init__(self):

        self.worker_names = [
            "Amit",
            "Rahul",
            "Rohan",
            "Vikram",
            "Suresh",
            "Karan",
            "Ajay",
            "Deepak"
        ]

    def generate_workers(self, scenario):

        workers = []

        count = scenario["workers"]

        for i in range(count):

            worker = {

                "id": f"W{i+1:03}",

                "name": self.worker_names[i],

                "zone": scenario["zone"],

                "helmet": random.choice([True, True, True, False]),

                "vest": random.choice([True, True, True, False]),

                "status": random.choice(
                    [
                        "Working",
                        "Inspecting",
                        "Walking"
                    ]
                )

            }

            workers.append(worker)

        return workers