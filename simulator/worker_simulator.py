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

    def generate_workers(self, scenario, vision_data=None):

        ZONE_TO_CAMERA_KEY = {
            'Boiler Room': 'camera_1',
            'Gas Pipeline': 'camera_2',
            'Coke Oven Battery': 'camera_3',
            'Valve Station': 'camera_4',
            'Storage Tank': 'camera_5',
        }

        workers = []
        worker_id_counter = 1

        all_zones = ['Boiler Room', 'Gas Pipeline', 'Coke Oven Battery', 'Valve Station', 'Storage Tank', 'Control Room']

        for zone in all_zones:
            camera_key = ZONE_TO_CAMERA_KEY.get(zone)
            camera_data = vision_data.get(camera_key) if (vision_data and camera_key) else None

            if camera_data:
                person_count = camera_data.get("person_count", 0)
                helmet_count = camera_data.get("helmet_count", 0)
                vest_count = camera_data.get("vest_count", 0)
            else:
                # Fallback for zones without camera (like Control Room) or if vision_data is empty/missing
                if zone == scenario.get("zone"):
                    person_count = scenario.get("workers", 0)
                else:
                    person_count = 0
                # Default mock compliance in fallback
                helmet_count = person_count
                vest_count = person_count

            for i in range(person_count):
                has_helmet = (i < helmet_count)
                has_vest = (i < vest_count)

                name_idx = (worker_id_counter - 1) % len(self.worker_names)
                name = self.worker_names[name_idx]

                worker = {
                    "id": f"W{worker_id_counter:03}",
                    "name": name,
                    "zone": zone,
                    "helmet": has_helmet,
                    "vest": has_vest,
                    "status": random.choice(["Working", "Inspecting", "Walking"])
                }
                workers.append(worker)
                worker_id_counter += 1

        return workers