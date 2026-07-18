import cv2
from ultralytics import YOLO


class VisionEngine:

    def __init__(self):

        print("Loading YOLO Model...")

        self.model = YOLO("yolov8n.pt")

        print("✅ Vision Engine Ready")


    def analyze_frame(self, frame):

        results = self.model(frame)

        person_count = 0

        detections = []

        for result in results:

            for box in result.boxes:

                cls = int(box.cls[0])

                conf = float(box.conf[0])

                label = self.model.names[cls]

                detections.append({

                    "label": label,
                    "confidence": round(conf, 2)

                })

                if label == "person":

                    person_count += 1

        return {

            "person_count": person_count,

            "helmet_count": 0,

            "vest_count": 0,

            "fire_detected": False,

            "smoke_detected": False,

            "detections": detections
        }


    def analyze_video(self, video_path):

        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():

            return None

        total_frames = int(
            cap.get(
                cv2.CAP_PROP_FRAME_COUNT
            )
        )

        middle_frame = total_frames // 2

        cap.set(
            cv2.CAP_PROP_POS_FRAMES,
            middle_frame
        )

        ret, frame = cap.read()

        cap.release()

        if not ret:

            return None

        return self.analyze_frame(frame)