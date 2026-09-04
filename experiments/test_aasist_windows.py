import sys
from pathlib import Path

import numpy as np
import torch
import librosa


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]
AASIST_ROOT = PROJECT_ROOT / "aasist"

sys.path.insert(0, str(AASIST_ROOT))

from models.AASIST import Model


# ============================================================
# CONFIGURATION
# ============================================================

AUDIO_FILE = PROJECT_ROOT / "data" / "test_audio" / "sample.wav"
MODEL_FILE = AASIST_ROOT / "models" / "weights" / "AASIST.pth"

SAMPLE_RATE = 16000

# Official AASIST input length
TARGET_LENGTH = 64600

# Test windows every 3 seconds
WINDOW_STEP = 3 * SAMPLE_RATE

DEVICE = torch.device("cpu")


# ============================================================
# HELPER: PREPARE AUDIO LIKE AASIST
# ============================================================

def prepare_aasist_input(audio):
    """
    Prepare an audio segment for AASIST.

    Official AASIST uses 64600 samples.
    If the segment is shorter, repeat the waveform.
    If longer, truncate it.
    """

    if len(audio) >= TARGET_LENGTH:
        return audio[:TARGET_LENGTH]

    # Repeat waveform until we reach TARGET_LENGTH
    repeat_count = int(np.ceil(TARGET_LENGTH / len(audio)))

    padded = np.tile(audio, repeat_count)

    return padded[:TARGET_LENGTH]


# ============================================================
# LOAD MODEL
# ============================================================

print("=" * 70)
print("AASIST MULTI-WINDOW DIAGNOSTIC TEST")
print("=" * 70)

print(f"\nDevice: {DEVICE}")
print(f"Audio: {AUDIO_FILE}")
print(f"Model: {MODEL_FILE}")

if not AUDIO_FILE.exists():
    raise FileNotFoundError(
        f"Audio file not found: {AUDIO_FILE}"
    )

if not MODEL_FILE.exists():
    raise FileNotFoundError(
        f"Model file not found: {MODEL_FILE}"
    )


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

print("AASIST loaded successfully.")


# ============================================================
# LOAD AUDIO
# ============================================================

print("\nLoading audio...")

audio, _ = librosa.load(
    AUDIO_FILE,
    sr=SAMPLE_RATE,
    mono=True,
)

audio = audio.astype(np.float32)

duration = len(audio) / SAMPLE_RATE

print(f"Sample rate: {SAMPLE_RATE} Hz")
print(f"Samples: {len(audio)}")
print(f"Duration: {duration:.2f} seconds")


# ============================================================
# MULTI-WINDOW INFERENCE
# ============================================================

print("\n" + "=" * 70)
print("WINDOW ANALYSIS")
print("=" * 70)

results = []

window_number = 1
start = 0

while start < len(audio):

    end = start + TARGET_LENGTH

    segment = audio[start:end]

    actual_duration = len(segment) / SAMPLE_RATE

    # Prepare exactly 64600 samples
    aasist_input = prepare_aasist_input(segment)

    audio_tensor = torch.tensor(
        aasist_input,
        dtype=torch.float32,
    ).unsqueeze(0).to(DEVICE)

    # --------------------------------------------------------
    # INFERENCE
    # --------------------------------------------------------

    with torch.no_grad():
        output = model(audio_tensor)

    # Official AASIST returns a tuple.
    # output[1] contains classification logits.
    logits = output[1]

    probabilities = torch.softmax(
        logits,
        dim=1,
    )

    spoof_probability = probabilities[0, 0].item()
    bonafide_probability = probabilities[0, 1].item()

    if spoof_probability >= 0.75:
        prediction = "SPOOF"
    else:
        prediction = "BONAFIDE"

    start_seconds = start / SAMPLE_RATE
    end_seconds = min(end, len(audio)) / SAMPLE_RATE

    results.append({
        "window": window_number,
        "start": start_seconds,
        "end": end_seconds,
        "spoof": spoof_probability,
        "bonafide": bonafide_probability,
        "prediction": prediction,
    })

    print(
        f"\nWindow {window_number}"
    )

    print(
        f"Time: {start_seconds:.2f}s - {end_seconds:.2f}s"
    )

    print(
        f"Actual audio: {actual_duration:.2f}s"
    )

    print(
        f"Spoof probability:    {spoof_probability:.6f}"
    )

    print(
        f"Bonafide probability: {bonafide_probability:.6f}"
    )

    print(
        f"Prediction: {prediction}"
    )

    # Move to next window
    start += WINDOW_STEP
    window_number += 1


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)

spoof_count = sum(
    1 for result in results
    if result["prediction"] == "SPOOF"
)

bonafide_count = sum(
    1 for result in results
    if result["prediction"] == "BONAFIDE"
)

print(f"\nTotal windows: {len(results)}")
print(f"SPOOF windows: {spoof_count}")
print(f"BONAFIDE windows: {bonafide_count}")

average_spoof = np.mean(
    [result["spoof"] for result in results]
)

print(
    f"\nAverage spoof probability: "
    f"{average_spoof:.6f}"
)

print("\nWindow-by-window result:")

for result in results:
    print(
        f"Window {result['window']:02d} | "
        f"{result['start']:6.2f}s - "
        f"{result['end']:6.2f}s | "
        f"Spoof: {result['spoof']:.4f} | "
        f"{result['prediction']}"
    )

print("\n" + "=" * 70)
print("MULTI-WINDOW TEST COMPLETE")
print("=" * 70)