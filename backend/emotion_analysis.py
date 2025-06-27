
from deepface import DeepFace
import sys
import json

def detect_emotions_from_video(video_path):
    try:
        analysis = DeepFace.analyze(video_path, actions=['emotion'], enforce_detection=False, silent=True)
        emotions = [frame['dominant_emotion'] for frame in analysis]
        dominant = max(set(emotions), key=emotions.count)
        return {"dominant_emotion": dominant}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    video_path = sys.argv[1]
    result = detect_emotions_from_video(video_path)
    print(json.dumps(result))
