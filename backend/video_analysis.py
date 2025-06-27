import sys, json

def main(video_path):
    # Your video analysis logic here.
    # Return as a dict, then print JSON.
    # Example result:
    result = {"duration": 120, "frames": 3600}
    print(json.dumps(result))

if __name__ == "__main__":
    main(sys.argv[1])
