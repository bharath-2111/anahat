import sys
from pathlib import Path

import torch

# ---------------------------------------------------------
# Add the official AASIST repository to Python path
# ---------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parents[1]
AASIST_ROOT = PROJECT_ROOT / "aasist"

sys.path.insert(0, str(AASIST_ROOT))

from models.AASIST import Model


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------
CONFIG_FILE = AASIST_ROOT / "config" / "AASIST.conf"
MODEL_FILE = AASIST_ROOT / "models" / "weights" / "AASIST.pth"

AUDIO_FILE = PROJECT_ROOT / "data" / "test_audio" / "sample.mp3"


# ---------------------------------------------------------
# Device
# ---------------------------------------------------------
DEVICE = torch.device("cpu")


print("=" * 60)
print("AASIST INFERENCE TEST")
print("=" * 60)

print(f"\nDevice: {DEVICE}")
print(f"AASIST repository: {AASIST_ROOT}")
print(f"Config: {CONFIG_FILE}")
print(f"Model: {MODEL_FILE}")
print(f"Audio: {AUDIO_FILE}")


# ---------------------------------------------------------
# Check files
# ---------------------------------------------------------
print("\nChecking files...")

if not CONFIG_FILE.exists():
    raise FileNotFoundError(f"Config not found: {CONFIG_FILE}")

if not MODEL_FILE.exists():
    raise FileNotFoundError(f"Model weights not found: {MODEL_FILE}")

if not AUDIO_FILE.exists():
    raise FileNotFoundError(f"Audio file not found: {AUDIO_FILE}")

print("All required files found.")


# ---------------------------------------------------------
# Load configuration
# ---------------------------------------------------------
print("\nLoading configuration...")

import json

with open(CONFIG_FILE, "r") as file:
    config_text = file.read()

print("Configuration file loaded.")


# ---------------------------------------------------------
# Load AASIST model
# ---------------------------------------------------------
print("\nLoading AASIST model...")

model_config = {
    "architecture": "AASIST",
    "nb_samp": 64600,
    "first_conv": 128,
    "filts": [
        70,
        [1, 32],
        [32, 32],
        [32, 64],
        [64, 64],
    ],
    "gat_dims": [64, 32],
    "pool_ratios": [0.5, 0.7, 0.5, 0.5],
    "temperatures": [2.0, 2.0, 100.0, 100.0],
}

model = Model(model_config).to(DEVICE)

print("AASIST architecture created.")


# ---------------------------------------------------------
# Load pretrained weights
# ---------------------------------------------------------
print("\nLoading pretrained weights...")

checkpoint = torch.load(
    MODEL_FILE,
    map_location=DEVICE,
)

if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
    state_dict = checkpoint["state_dict"]
else:
    state_dict = checkpoint

model.load_state_dict(state_dict)

model.eval()

print("Pretrained AASIST weights loaded successfully.")


# ---------------------------------------------------------
# Test with dummy audio
# ---------------------------------------------------------
print("\nPreparing test audio...")

import librosa
import numpy as np

audio, _ = librosa.load(
    AUDIO_FILE,
    sr=16000,
    mono=True,
)

audio = audio.astype(np.float32)

print(f"Audio samples: {len(audio)}")
print(f"Audio duration: {len(audio) / 16000:.2f} seconds")


# ---------------------------------------------------------
# Prepare exactly 64600 samples for AASIST
# ---------------------------------------------------------
TARGET_LENGTH = 64600

if len(audio) < TARGET_LENGTH:

    print("Audio is shorter than AASIST input size.")
    print("Padding audio...")

    audio = np.pad(
        audio,
        (0, TARGET_LENGTH - len(audio)),
        mode="constant",
    )

elif len(audio) > TARGET_LENGTH:

    print("Audio is longer than AASIST input size.")
    print("Taking first AASIST window...")

    audio = audio[:TARGET_LENGTH]


print(f"AASIST input samples: {len(audio)}")


# ---------------------------------------------------------
# Convert to PyTorch tensor
# ---------------------------------------------------------
audio_tensor = torch.tensor(
    audio,
    dtype=torch.float32,
).unsqueeze(0).to(DEVICE)


print(f"Tensor shape: {audio_tensor.shape}")


# ---------------------------------------------------------
# Run AASIST
# ---------------------------------------------------------
print("\nRunning AASIST inference...")

with torch.no_grad():

    output = model(audio_tensor)

print("\nAASIST raw output:")
print(output)


# ---------------------------------------------------------
# AASIST returns a tuple
# ---------------------------------------------------------
model_output = output[1]

print("\nClassification logits:")
print(model_output)

print(f"Output shape: {model_output.shape}")


# ---------------------------------------------------------
# Convert logits to probabilities
# ---------------------------------------------------------
probabilities = torch.softmax(
    model_output,
    dim=1,
)

print("\nClass probabilities:")
print(probabilities)


spoof_probability = probabilities[0, 0].item()
bonafide_probability = probabilities[0, 1].item()

print(f"\nSpoof probability: {spoof_probability:.6f}")
print(f"Bonafide probability: {bonafide_probability:.6f}")

predicted_class = torch.argmax(
    probabilities,
    dim=1,
).item()

print(f"\nPredicted class index: {predicted_class}")

if predicted_class == 0:
    print("Prediction: SPOOF")
else:
    print("Prediction: BONAFIDE / GENUINE")

print("\n" + "=" * 60)
print("AASIST TEST COMPLETE")
print("=" * 60)