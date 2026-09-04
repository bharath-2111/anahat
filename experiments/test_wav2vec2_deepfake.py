from pathlib import Path

import numpy as np
import torch
import librosa

from transformers import (
    Wav2Vec2FeatureExtractor,
    AutoModelForAudioClassification,
)


# ============================================================
# PROJECT CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

AUDIO_FILE = (
    PROJECT_ROOT
    / "data"
    / "test_audio"
    / "sample.wav"
)

MODEL_NAME = "Vansh180/deepfake-audio-wav2vec2"

SAMPLE_RATE = 16000

DEVICE = torch.device("cpu")


# ============================================================
# HEADER
# ============================================================

print("=" * 70)
print("FINE-TUNED WAV2VEC2 DEEPFAKE DETECTION TEST")
print("=" * 70)

print(f"\nDevice: {DEVICE}")
print(f"Audio: {AUDIO_FILE}")
print(f"Model: {MODEL_NAME}")


# ============================================================
# CHECK AUDIO
# ============================================================

if not AUDIO_FILE.exists():
    raise FileNotFoundError(
        f"Audio file not found: {AUDIO_FILE}"
    )


# ============================================================
# LOAD PROCESSOR
# ============================================================

print("\nLoading processor...")

processor = Wav2Vec2FeatureExtractor.from_pretrained(
    MODEL_NAME
)

print("Processor loaded successfully.")


# ============================================================
# LOAD MODEL
# ============================================================

print("\nLoading fine-tuned Wav2Vec2 model...")

model = AutoModelForAudioClassification.from_pretrained(
    MODEL_NAME
)

model.to(DEVICE)
model.eval()

print("Model loaded successfully.")


# ============================================================
# DISPLAY MODEL LABELS
# ============================================================

print("\nModel labels:")

print(model.config.id2label)


# ============================================================
# LOAD AUDIO
# ============================================================

print("\nLoading audio...")

audio, original_sample_rate = librosa.load(
    AUDIO_FILE,
    sr=SAMPLE_RATE,
    mono=True,
)

audio = audio.astype(np.float32)

duration = len(audio) / SAMPLE_RATE

print(f"Original sample rate: {original_sample_rate} Hz")
print(f"Processed sample rate: {SAMPLE_RATE} Hz")
print(f"Number of samples: {len(audio)}")
print(f"Duration: {duration:.2f} seconds")


# ============================================================
# RUN PROCESSOR
# ============================================================

print("\nProcessing audio...")

inputs = processor(
    audio,
    sampling_rate=SAMPLE_RATE,
    return_tensors="pt",
    padding=True,
)

inputs = {
    key: value.to(DEVICE)
    for key, value in inputs.items()
}

print("Audio processed successfully.")


# ============================================================
# MODEL INFERENCE
# ============================================================

print("\nRunning fine-tuned Wav2Vec2 inference...")

with torch.no_grad():
    outputs = model(**inputs)


# ============================================================
# LOGITS
# ============================================================

logits = outputs.logits

print("\nRaw logits:")
print(logits)

print(f"Logit shape: {logits.shape}")


# ============================================================
# PROBABILITIES
# ============================================================

probabilities = torch.softmax(
    logits,
    dim=-1,
)

print("\nClass probabilities:")

for class_index, probability in enumerate(
    probabilities[0]
):
    label = model.config.id2label.get(
        class_index,
        str(class_index)
    )

    print(
        f"Class {class_index} "
        f"({label}): "
        f"{probability.item():.6f}"
    )


# ============================================================
# PREDICTION
# ============================================================

predicted_class = torch.argmax(
    probabilities,
    dim=-1,
).item()

predicted_label = model.config.id2label.get(
    predicted_class,
    str(predicted_class)
)

confidence = probabilities[
    0,
    predicted_class
].item()


# ============================================================
# NORMALIZE LABEL
# ============================================================

label_lower = predicted_label.lower()

if (
    "spoof" in label_lower
    or "fake" in label_lower
    or "deepfake" in label_lower
):
    prediction = "SPOOF"

elif (
    "real" in label_lower
    or "bonafide" in label_lower
    or "bona" in label_lower
):
    prediction = "BONAFIDE"

else:
    prediction = predicted_label.upper()


# ============================================================
# FINAL RESULT
# ============================================================

print("\n" + "=" * 70)
print("FINAL RESULT")
print("=" * 70)

print(f"\nPredicted class: {predicted_label}")
print(f"Prediction: {prediction}")
print(f"Confidence: {confidence:.6f}")

print("\n" + "=" * 70)
print("FINE-TUNED WAV2VEC2 TEST COMPLETE")
print("=" * 70)