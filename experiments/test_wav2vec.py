import torch
from transformers import Wav2Vec2Processor, Wav2Vec2Model

from backend.preprocessing.audio import preprocess_audio


AUDIO_FILE = "data/test_audio/sample.wav"

MODEL_NAME = "facebook/wav2vec2-base"


print("=" * 60)
print("WAV2VEC 2.0 TEST")
print("=" * 60)

print("\nLoading Wav2Vec 2.0...")

processor = Wav2Vec2Processor.from_pretrained(MODEL_NAME)
model = Wav2Vec2Model.from_pretrained(MODEL_NAME)

model.eval()

print("Model loaded successfully.")

print("\nLoading audio...")
audio = preprocess_audio(AUDIO_FILE)

print(f"Audio samples: {len(audio)}")
print(f"Audio duration: {len(audio) / 16000:.2f} seconds")

print("\nPassing audio through Wav2Vec 2.0...")

inputs = processor(
    audio,
    sampling_rate=16000,
    return_tensors="pt",
    padding=True,
)

with torch.no_grad():
    outputs = model(**inputs)

embeddings = outputs.last_hidden_state

print("\nWav2Vec 2.0 output:")
print(f"Shape: {embeddings.shape}")

print("\nSTATUS: SUCCESS")

print("=" * 60)