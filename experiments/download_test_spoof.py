import requests
import os

OUTPUT_DIR = "data/test_audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

DATASET = "SpeechAntiSpoofingBenchmarks/InTheWild"
CONFIG = "default"
SPLIT = "test"

TARGETS = {
    0: ("0.wav", "SPOOF"),
    1: ("1.wav", "SPOOF"),
    4: ("4.wav", "REAL"),
    5: ("5.wav", "REAL"),
}

API_URL = "https://datasets-server.huggingface.co/rows"

print("Downloading selected audio samples...\n")

for index, (filename, expected_label) in TARGETS.items():

    print(f"Fetching index {index} -> {filename} ({expected_label})")

    params = {
        "dataset": DATASET,
        "config": CONFIG,
        "split": SPLIT,
        "offset": index,
        "length": 1,
    }

    try:
        response = requests.get(API_URL, params=params, timeout=60)
        response.raise_for_status()

        data = response.json()

        row = data["rows"][0]["row"]
        audio = row["audio"]

        audio_url = audio["src"]

        print(f"Audio URL obtained.")

        audio_response = requests.get(audio_url, timeout=120)
        audio_response.raise_for_status()

        output_path = os.path.join(OUTPUT_DIR, filename)

        with open(output_path, "wb") as f:
            f.write(audio_response.content)

        print(f"Saved: {output_path}")
        print(f"Expected: {expected_label}")
        print()

    except Exception as e:
        print(f"ERROR processing {filename}")
        print(e)
        print()

print("Finished.")