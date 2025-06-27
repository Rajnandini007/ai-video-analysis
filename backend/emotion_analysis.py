import sys, json

def main(video_path):
    # Example: analyze emotions
    result = {"happy": 0.75, "sad": 0.1, "neutral": 0.15}
    print(json.dumps(result))

if __name__ == "__main__":
    main(sys.argv[1])
