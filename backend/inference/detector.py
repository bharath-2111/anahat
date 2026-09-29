import torch
import librosa
import numpy as np
from transformers import Wav2Vec2FeatureExtractor, AutoModelForAudioClassification


MODEL_NAME = "garystafford/wav2vec2-deepfake-voice-detector"
SAMPLE_RATE = 16000

# 4-second analysis window
WINDOW_SIZE = 4 * SAMPLE_RATE

# 3-second step = 1-second overlap
STEP_SIZE = 3 * SAMPLE_RATE


class VoiceSpoofDetector:

    def __init__(self):
        print("Loading Anahat voice detector...")

        self.processor = Wav2Vec2FeatureExtractor.from_pretrained(
            MODEL_NAME
        )

        self.model = AutoModelForAudioClassification.from_pretrained(
            MODEL_NAME
        )

        self.model.eval()

        print("Model loaded successfully.")

    def _prepare_window(self, audio):
        """
        Make every window exactly 4 seconds long.
        Short audio is repeated to fill the window.
        """

        if len(audio) < WINDOW_SIZE:

            if len(audio) == 0:
                return None

            repeats = (WINDOW_SIZE // len(audio)) + 1

            audio = np.tile(audio, repeats)

            audio = audio[:WINDOW_SIZE]

        else:
            audio = audio[:WINDOW_SIZE]

        return audio.astype(np.float32)

    def _predict_window(self, audio):

        inputs = self.processor(
            audio,
            sampling_rate=SAMPLE_RATE,
            return_tensors="pt"
        )

        with torch.no_grad():
            outputs = self.model(**inputs)

            probabilities = torch.softmax(
                outputs.logits,
                dim=-1
            )[0]

        fake_probability = None
        real_probability = None

        for i, probability in enumerate(probabilities):

            label = self.model.config.id2label[i].lower()

            if "fake" in label or "spoof" in label:
                fake_probability = probability.item()

            elif "real" in label or "bonafide" in label:
                real_probability = probability.item()

        # Safety fallback if label names differ
        if fake_probability is None:
            fake_probability = probabilities[-1].item()

        if real_probability is None:
            real_probability = 1.0 - fake_probability

        print(
            "[AASIST3]",
            "logits=",
            outputs.logits.detach().cpu().numpy(),
            "probabilities=",
            probabilities.detach().cpu().numpy()
        )

        return {
            "fake_probability": fake_probability,
            "real_probability": real_probability
        }

    def predict(self, audio):

        if len(audio) == 0:
            raise ValueError("Audio file is empty.")

        windows = []

        # Create overlapping windows
        if len(audio) <= WINDOW_SIZE:

            windows.append(audio)

        else:

            for start in range(
                0,
                len(audio) - WINDOW_SIZE + 1,
                STEP_SIZE
            ):

                end = start + WINDOW_SIZE

                windows.append(audio[start:end])

            # Make sure the end of the recording is also analyzed
            if len(audio) > WINDOW_SIZE:

                last_start = len(audio) - WINDOW_SIZE

                last_window = audio[
                    last_start:last_start + WINDOW_SIZE
                ]

                if not np.array_equal(
                    last_window,
                    windows[-1]
                ):
                    windows.append(last_window)

        results = []

        for index, window in enumerate(windows):

            prepared = self._prepare_window(window)

            if prepared is None:
                continue

            prediction = self._predict_window(prepared)

            results.append({
                "window": index + 1,
                **prediction
            })

        if not results:
            raise ValueError("Could not analyze audio.")

        # Average probability across windows
        avg_fake = float(
            np.mean(
                [r["fake_probability"] for r in results]
            )
        )

        avg_real = float(
            np.mean(
                [r["real_probability"] for r in results]
            )
        )

        # Final classification
        if avg_fake >= 0.50:
            prediction = "SPOOF"
        else:
            prediction = "REAL"

        return {
            "prediction": prediction,
            "spoof_probability": round(avg_fake, 4),
            "real_probability": round(avg_real, 4),
            "windows_analyzed": len(results),
            "windows": results
        }


# Load the model once when the backend starts
detector = VoiceSpoofDetector()