# video_analysis.py

import cv2
import sys
import json

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Cannot open video."}

    # Dummy analysis
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1
    cap.release()

    return {
        'confidence': 'Moderate',
        'eye_movement': 'Frequent blinking',
        'speech_analysis': 'Slightly fast',
        'tone': 'Neutral',
        'grammar_mistakes': 2
    }

if __name__ == "__main__":
    video_path = sys.argv[1]
    try:
        result = analyze_video(video_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
