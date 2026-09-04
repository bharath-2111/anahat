import torch
import librosa
from transformers import Wav2Vec2FeatureExtractor, AutoModelForAudioClassification

MODEL_NAME = "garystafford/wav2vec2-deepfake-voice-detector"

AUDIO_FILE = "data/test_audio/sample_telugu.wav"

print("Loading model...")
print(MODEL_NAME)

processor = Wav2Vec2FeatureExtractor.from_pretrained(MODEL_NAME)
model = AutoModelForAudioClassification.from_pretrained(MODEL_NAME)

model.eval()

print("\nLoading audio...")

audio, sr = librosa.load(
    AUDIO_FILE,
    sr=16000,
    mono=True
)

print(f"Sample rate: {sr}")
print(f"Duration: {len(audio) / sr:.2f} seconds")

# Use a 4-second window
WINDOW_SIZE = 4 * 16000

if len(audio) < WINDOW_SIZE:
    repeats = (WINDOW_SIZE // len(audio)) + 1
    audio = audio.repeat(repeats)[:WINDOW_SIZE]
else:
    audio = audio[:WINDOW_SIZE]

inputs = processor(
    audio,
    sampling_rate=16000,
    return_tensors="pt"
)

with torch.no_grad():
    outputs = model(**inputs)
    probabilities = torch.softmax(outputs.logits, dim=-1)[0]

print("\nModel classes:")
print(model.config.id2label)

print("\nPrediction probabilities:")

for i, probability in enumerate(probabilities):
    label = model.config.id2label[i]
    print(f"{label}: {probability.item():.4f}")

predicted_class = torch.argmax(probabilities).item()
predicted_label = model.config.id2label[predicted_class]

print("\n==============================")
print("FINAL RESULT")
print("==============================")
print(f"Prediction: {predicted_label}")
print(f"Confidence: {probabilities[predicted_class].item():.4f}")