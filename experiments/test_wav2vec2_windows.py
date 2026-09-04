from pathlib import Path

import numpy as np
import torch
import librosa

from transformers import (
    Wav2Vec2FeatureExtractor,
    AutoModelForAudioClassification,
)


# ============================================================
# CONFIGURATION
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

# Approximately 4 seconds
WINDOW_DURATION = 4

# Move 3 seconds each time
WINDOW_STEP = 3

WINDOW_SIZE = SAMPLE_RATE * WINDOW_DURATION
STEP_SIZE = SAMPLE_RATE * WINDOW_STEP

DEVICE = torch.device("cpu")


# ============================================================
# HEADER
# ============================================================

print("=" * 70)
print("FINE-TUNED WAV2VEC2 MULTI-WINDOW TEST")
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
# LOAD FEATURE EXTRACTOR
# ============================================================

print("\nLoading feature extractor...")

processor = Wav2Vec2FeatureExtractor.from_pretrained(
    MODEL_NAME
)

print("Feature extractor loaded successfully.")


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
# SHOW LABELS
# ============================================================

print("\nModel labels:")

print(model.config.id2label)


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
# FUNCTION TO PROCESS ONE WINDOW
# ============================================================

def analyze_window(audio_window):

    inputs = processor(
        audio_window,
        sampling_rate=SAMPLE_RATE,
        return_tensors="pt",
        padding=True,
    )

    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits

    probabilities = torch.softmax(
        logits,
        dim=-1,
    )[0]

    predicted_class = torch.argmax(
        probabilities
    ).item()

    predicted_label = model.config.id2label.get(
        predicted_class,
        str(predicted_class)
    )

    return probabilities, predicted_label


# ============================================================
# MULTI-WINDOW ANALYSIS
# ============================================================

print("\n" + "=" * 70)
print("WINDOW ANALYSIS")
print("=" * 70)

results = []

start = 0
window_number = 1

while start < len(audio):

    end = start + WINDOW_SIZE

    window = audio[start:end]

    actual_length = len(window)

    # --------------------------------------------------------
    # If the final window is shorter than 4 seconds,
    # repeat the waveform until it reaches 4 seconds.
    # --------------------------------------------------------

    if actual_length < WINDOW_SIZE:

        if actual_length == 0:
            break

        repeat_count = int(
            np.ceil(WINDOW_SIZE / actual_length)
        )

        window = np.tile(
            window,
            repeat_count
        )[:WINDOW_SIZE]

    probabilities, predicted_label = analyze_window(
        window
    )

    start_seconds = start / SAMPLE_RATE
    end_seconds = min(
        end,
        len(audio)
    ) / SAMPLE_RATE

    # --------------------------------------------------------
    # Extract probabilities
    # --------------------------------------------------------

    class_probabilities = {}

    for class_index, probability in enumerate(
        probabilities
    ):

        label = model.config.id2label.get(
            class_index,
            str(class_index)
        )

        class_probabilities[
            label.lower()
        ] = probability.item()

    # --------------------------------------------------------
    # Find fake probability
    # --------------------------------------------------------

    fake_probability = None

    for label, probability in class_probabilities.items():

        if (
            "fake" in label
            or "spoof" in label
            or "deepfake" in label
        ):
            fake_probability = probability
            break

    # If the model doesn't expose a fake label,
    # use the non-real class carefully.
    if fake_probability is None:

        for label, probability in class_probabilities.items():

            if (
                "real" not in label
                and "bonafide" not in label
                and "bona" not in label
            ):
                fake_probability = probability
                break

    if fake_probability is None:
        fake_probability = 0.0

    # --------------------------------------------------------
    # Store result
    # --------------------------------------------------------

    results.append({
        "window": window_number,
        "start": start_seconds,
        "end": end_seconds,
        "fake_probability": fake_probability,
        "prediction": predicted_label,
    })

    # --------------------------------------------------------
    # Print result
    # --------------------------------------------------------

    print(
        f"\nWindow {window_number:02d}"
    )

    print(
        f"Time: "
        f"{start_seconds:.2f}s - "
        f"{end_seconds:.2f}s"
    )

    print(
        "Probabilities:"
    )

    for label, probability in class_probabilities.items():

        print(
            f"  {label}: {probability:.6f}"
        )

    print(
        f"Prediction: {predicted_label}"
    )

    # --------------------------------------------------------
    # Move to next window
    # --------------------------------------------------------

    start += STEP_SIZE
    window_number += 1


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)

fake_probabilities = [
    result["fake_probability"]
    for result in results
]

if fake_probabilities:

    average_fake = np.mean(
        fake_probabilities
    )

    minimum_fake = np.min(
        fake_probabilities
    )

    maximum_fake = np.max(
        fake_probabilities
    )

    fake_count = sum(
        1
        for probability in fake_probabilities
        if probability >= 0.50
    )

    print(
        f"\nTotal windows: "
        f"{len(results)}"
    )

    print(
        f"Average fake probability: "
        f"{average_fake:.6f}"
    )

    print(
        f"Minimum fake probability: "
        f"{minimum_fake:.6f}"
    )

    print(
        f"Maximum fake probability: "
        f"{maximum_fake:.6f}"
    )

    print(
        f"Windows leaning FAKE: "
        f"{fake_count}"
    )

    print(
        f"Windows leaning REAL: "
        f"{len(results) - fake_count}"
    )


# ============================================================
# WINDOW-BY-WINDOW SUMMARY
# ============================================================

print("\nWindow-by-window result:")

for result in results:

    print(
        f"Window {result['window']:02d} | "
        f"{result['start']:6.2f}s - "
        f"{result['end']:6.2f}s | "
        f"Fake: "
        f"{result['fake_probability']:.4f} | "
        f"{result['prediction']}"
    )


print("\n" + "=" * 70)
print("MULTI-WINDOW TEST COMPLETE")
print("=" * 70)