import sys
import os

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.insert(0, PROJECT_ROOT)

from backend.inference.detector import detector
from backend.preprocessing.audio import preprocess_audio


AUDIO_FILE = "data/test_audio/sample_telugu.wav"


print("\n==============================")
print("VOXSHIELD VOICE DETECTION TEST")
print("==============================")

print(f"\nAudio: {AUDIO_FILE}")

audio = preprocess_audio(AUDIO_FILE)

print(f"Samples: {len(audio)}")
print(f"Duration: {len(audio) / 16000:.2f} seconds")

result = detector.predict(audio)

print("\n==============================")
print("FINAL RESULT")
print("==============================")

print(f"Prediction: {result['prediction']}")
print(f"Spoof probability: {result['spoof_probability']}")
print(f"Real probability: {result['real_probability']}")
print(f"Windows analyzed: {result['windows_analyzed']}")

print("\nWindow results:")

for window in result["windows"]:

    print(
        f"Window {window['window']:02d} | "
        f"Fake: {window['fake_probability']:.4f} | "
        f"Real: {window['real_probability']:.4f}"
    )