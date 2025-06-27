
import moviepy.editor as mp
import speech_recognition as sr
import os
import sys
import json

def extract_audio_and_transcribe(video_path):
    audio_path = "temp_audio.wav"
    try:
        video = mp.VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path, logger=None)

        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
        transcript = recognizer.recognize_google(audio)
        os.remove(audio_path)
        return {"transcript": transcript}
    except Exception as e:
        if os.path.exists(audio_path): os.remove(audio_path)
        return {"error": str(e)}

if __name__ == "__main__":
    video_path = sys.argv[1]
    result = extract_audio_and_transcribe(video_path)
    print(json.dumps(result))
