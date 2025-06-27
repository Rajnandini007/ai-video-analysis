import sys, json

def main(video_path):
    # Example: speech to text or sentiment
    result = {"transcript": "Hello world", "sentiment": "positive"}
    print(json.dumps(result))

if __name__ == "__main__":
    main(sys.argv[1])
