from AI.vision_engine import VisionEngine


vision = VisionEngine()

result = vision.analyze_video(
    "videos/cctv1.mp4"
)

print(result)