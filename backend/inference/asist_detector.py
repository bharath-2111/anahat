# import torch
# import torchaudio
# import numpy as np

# from AASIST3.model import aasist3



# MODEL_NAME = "MTUCI/AASIST3"
# SAMPLE_RATE = 16000

# # 4-second analysis window
# WINDOW_SIZE = 4 * SAMPLE_RATE

# # 3-second step = 1-second overlap
# STEP_SIZE = 3 * SAMPLE_RATE


# class VoiceSpoofDetector:

#     def __init__(self):

#         print("Loading AASIST3 voice detector...")

#         self.device = torch.device(
#             "cuda" if torch.cuda.is_available() else "cpu"
#         )

#         self.model = aasist3.from_pretrained(
#             MODEL_NAME
#         )

#         self.model = self.model.to(self.device)
#         self.model.eval()

#         print(f"Device: {self.device}")
#         print("Model loaded successfully.")

#     def _prepare_audio(self, audio, sample_rate):

#         if audio is None or len(audio) == 0:
#             raise ValueError("Audio is empty.")

#         audio = np.asarray(
#             audio,
#             dtype=np.float32
#         )

#         # Convert stereo/multi-channel audio to mono
#         if audio.ndim > 1:
#             audio = np.mean(
#                 audio,
#                 axis=0
#             )

#         # Resample to 16 kHz
#         if sample_rate != SAMPLE_RATE:

#             tensor = torch.from_numpy(audio)

#             tensor = tensor.unsqueeze(0)

#             resampler = torchaudio.transforms.Resample(
#                 sample_rate,
#                 SAMPLE_RATE
#             )

#             tensor = resampler(tensor)

#             audio = tensor.squeeze(0).numpy()

#         return audio.astype(np.float32)

#     def _prepare_window(self, audio):

#         if audio is None or len(audio) < WINDOW_SIZE:
#             return None

#         return audio[:WINDOW_SIZE].astype(
#             np.float32
#         )

#     def _predict_window(self, audio):

#         waveform = torch.from_numpy(
#             audio
#         ).unsqueeze(0)

#         waveform = waveform.to(
#             self.device
#         )

#         with torch.no_grad():

#             output = self.model(
#                 waveform
#             )

#             # Some implementations return a tensor,
#             # while others return an object containing logits.
#             if hasattr(output, "logits"):
#                 logits = output.logits
#             elif isinstance(output, (tuple, list)):
#                 logits = output[0]
#             else:
#                 logits = output

#             probabilities = torch.softmax(
#                 logits,
#                 dim=-1
#             )

#         # AASIST3 uses:
#         # class 0 -> bonafide / real
#         # class 1 -> spoof / AI-generated
#         real_probability = probabilities[
#             0, 0
#         ].item()

#         spoof_probability = probabilities[
#             0, 1
#         ].item()

#         prediction = (
#             "SPOOF"
#             if spoof_probability >= 0.5
#             else "REAL"
#         )

#         return {
#             "prediction": prediction,
#             "spoof_probability": spoof_probability,
#             "real_probability": real_probability
#         }

#     def predict(self, audio, sample_rate=SAMPLE_RATE):

#         audio = self._prepare_audio(
#             audio,
#             sample_rate
#         )

#         if len(audio) < WINDOW_SIZE:
#             raise ValueError(
#                 "At least 4 seconds of real audio "
#                 "is required for prediction."
#             )

#         windows = []

#         for start in range(
#             0,
#             len(audio) - WINDOW_SIZE + 1,
#             STEP_SIZE
#         ):

#             end = start + WINDOW_SIZE

#             windows.append(
#                 audio[start:end]
#             )

#         # Make sure the final 4-second portion
#         # is also analyzed.
#         last_start = len(audio) - WINDOW_SIZE

#         if last_start > 0:

#             last_window = audio[
#                 last_start:last_start + WINDOW_SIZE
#             ]

#             if not np.array_equal(
#                 last_window,
#                 windows[-1]
#             ):
#                 windows.append(
#                     last_window
#                 )

#         results = []

#         for index, window in enumerate(windows):

#             prepared = self._prepare_window(
#                 window
#             )

#             if prepared is None:
#                 continue

#             prediction = self._predict_window(
#                 prepared
#             )

#             results.append({
#                 "window": index + 1,
#                 "start_seconds": round(
#                     (index * STEP_SIZE) / SAMPLE_RATE,
#                     2
#                 ),
#                 **prediction
#             })

#         if not results:
#             raise ValueError(
#                 "Could not analyze audio."
#             )

#         avg_spoof = float(
#             np.mean([
#                 result["spoof_probability"]
#                 for result in results
#             ])
#         )

#         avg_real = float(
#             np.mean([
#                 result["real_probability"]
#                 for result in results
#             ])
#         )

#         final_prediction = (
#             "SPOOF"
#             if avg_spoof >= 0.5
#             else "REAL"
#         )

#         return {
#             "prediction": final_prediction,
#             "spoof_probability": round(
#                 avg_spoof,
#                 4
#             ),
#             "real_probability": round(
#                 avg_real,
#                 4
#             ),
#             "windows_analyzed": len(results),
#             "windows": results
#         }


# class LiveAudioBuffer:

#     def __init__(self, detector):

#         self.detector = detector

#         self.buffer = np.array(
#             [],
#             dtype=np.float32
#         )

#     def add_audio(
#         self,
#         audio,
#         sample_rate=SAMPLE_RATE
#     ):

#         audio = self.detector._prepare_audio(
#             audio,
#             sample_rate
#         )

#         self.buffer = np.concatenate([
#             self.buffer,
#             audio
#         ])

#         predictions = []

#         # Do not duplicate or pad audio.
#         # Wait until 4 seconds of genuine
#         # audio are available.
#         while len(self.buffer) >= WINDOW_SIZE:

#             window = self.buffer[
#                 :WINDOW_SIZE
#             ]

#             result = self.detector._predict_window(
#                 window
#             )

#             predictions.append(result)

#             # Move forward by 1 second.
#             self.buffer = self.buffer[
#                 STEP_SIZE:
#             ]

#         return predictions


# # Load the model once when the backend starts.
# detector = VoiceSpoofDetector()

# # Use this object for live RTP/network audio.
# live_buffer = LiveAudioBuffer(detector)
import torch
import torchaudio
import numpy as np

from AASIST3.model import aasist3


MODEL_NAME = "MTUCI/AASIST3"
SAMPLE_RATE = 16000


WINDOW_SIZE = 64600
STEP_SIZE = 3 * SAMPLE_RATE

class VoiceSpoofDetector:

    def __init__(self):

        print("Loading AASIST3 voice detector...")

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.model = aasist3.from_pretrained(
            MODEL_NAME
        )

        self.model = self.model.to(self.device)
        self.model.eval()

        print(f"Device: {self.device}")
        print("Model loaded successfully.")

    def _prepare_audio(self, audio, sample_rate):

        if audio is None or len(audio) == 0:
            raise ValueError("Audio is empty.")

        audio = np.asarray(
            audio,
            dtype=np.float32
        )

        if audio.ndim > 1:
            audio = np.mean(
                audio,
                axis=0
            )

        if sample_rate != SAMPLE_RATE:

            tensor = torch.from_numpy(audio)

            tensor = tensor.unsqueeze(0)

            resampler = torchaudio.transforms.Resample(
                orig_freq=sample_rate,
                new_freq=SAMPLE_RATE
            )

            with torch.no_grad():
                tensor = resampler(tensor)

            audio = tensor.squeeze(0).numpy()

        return audio.astype(np.float32)

    def _prepare_window(self, audio):

        if audio is None or len(audio) == 0:
            return None

        audio = np.asarray(
            audio,
            dtype=np.float32
        )

        if len(audio) > WINDOW_SIZE:
            audio = audio[:WINDOW_SIZE]

        elif len(audio) < WINDOW_SIZE:

            padded = np.zeros(
                WINDOW_SIZE,
                dtype=np.float32
            )

            padded[:len(audio)] = audio

            audio = padded

        return audio

    def _predict_window(self, audio):

        audio = self._prepare_window(
            audio
        )

        if audio is None:
            raise ValueError(
                "Invalid audio window."
            )

        if len(audio) != WINDOW_SIZE:
            raise ValueError(
                f"Invalid window size: "
                f"{len(audio)}. "
                f"Expected {WINDOW_SIZE}."
            )

        max_amp = np.max(
            np.abs(audio)
        )

        if max_amp > 0:
            audio = audio / max_amp

        waveform = torch.from_numpy(
            audio
        ).unsqueeze(0)

        waveform = waveform.to(
            self.device
        )

        with torch.no_grad():

            output = self.model(
                waveform
            )

            if hasattr(output, "logits"):
                logits = output.logits

            elif isinstance(
                output,
                (tuple, list)
            ):
                logits = output[0]

            else:
                logits = output

            probabilities = torch.softmax(
                logits,
                dim=-1
            )
        print(
            "[AASIST3]",
            "logits=",
            logits.detach().cpu().numpy(),
            "probabilities=",
            probabilities.detach().cpu().numpy()
        )
        real_probability = probabilities[
            0, 0
        ].item()

        spoof_probability = probabilities[
            0, 1
        ].item()

        prediction = (
            "SPOOF"
            if spoof_probability >= 0.5
            else "REAL"
        )

        return {
            "prediction": prediction,
            "spoof_probability": spoof_probability,
            "real_probability": real_probability
        }

    def predict(
        self,
        audio,
        sample_rate=SAMPLE_RATE
    ):

        audio = self._prepare_audio(
            audio,
            sample_rate
        )

        if len(audio) < WINDOW_SIZE:
            raise ValueError(
                "At least 4 seconds of real audio "
                "is required for prediction."
            )

        windows = []

        for start in range(
            0,
            len(audio) - WINDOW_SIZE + 1,
            STEP_SIZE
        ):

            end = start + WINDOW_SIZE

            windows.append(
                audio[start:end]
            )

        last_start = len(audio) - WINDOW_SIZE

        if last_start > 0:

            last_window = audio[
                last_start:
                last_start + WINDOW_SIZE
            ]

            if not np.array_equal(
                last_window,
                windows[-1]
            ):

                windows.append(
                    last_window
                )

        results = []

        for index, window in enumerate(
            windows
        ):

            prepared = self._prepare_window(
                window
            )

            prediction = self._predict_window(
                prepared
            )

            results.append({

                "window":
                    index + 1,

                "start_seconds":
                    round(
                        (index * STEP_SIZE)
                        / SAMPLE_RATE,
                        2
                    ),

                **prediction
            })

        if not results:
            raise ValueError(
                "Could not analyze audio."
            )

        avg_spoof = float(
            np.mean([
                result["spoof_probability"]
                for result in results
            ])
        )

        avg_real = float(
            np.mean([
                result["real_probability"]
                for result in results
            ])
        )

        final_prediction = (
            "SPOOF"
            if avg_spoof >= 0.5
            else "REAL"
        )

        return {

            "prediction":
                final_prediction,

            "spoof_probability":
                round(
                    avg_spoof,
                    4
                ),

            "real_probability":
                round(
                    avg_real,
                    4
                ),

            "windows_analyzed":
                len(results),

            "windows":
                results
        }


class LiveAudioBuffer:

    def __init__(
        self,
        detector
    ):

        self.detector = detector

        self.buffer = np.array(
            [],
            dtype=np.float32
        )

    def add_audio(
        self,
        audio,
        sample_rate=SAMPLE_RATE
    ):

        if audio is None:
            return []

        audio = np.asarray(
            audio,
            dtype=np.float32
        )

        if len(audio) == 0:
            return []

        if sample_rate != SAMPLE_RATE:

            audio = self.detector._prepare_audio(
                audio,
                sample_rate
            )

        self.buffer = np.concatenate([
            self.buffer,
            audio
        ])

        predictions = []

        while len(self.buffer) >= WINDOW_SIZE:

            window = self.buffer[
                :WINDOW_SIZE
            ].copy()

            print(
                f"[AASIST3] "
                f"Running inference on "
                f"{len(window)} samples"
            )

            result = self.detector._predict_window(
                window
            )

            predictions.append(
                result
            )

            self.buffer = self.buffer[
                STEP_SIZE:
            ]

            print(
                f"[AASIST3] "
                f"Remaining buffer: "
                f"{len(self.buffer)} samples"
            )

        return predictions


detector = VoiceSpoofDetector()

live_buffer = LiveAudioBuffer(
    detector
)