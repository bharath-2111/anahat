import numpy as np
import librosa

from backend.config import (
    SAMPLE_RATE,
    CHUNK_DURATION,
    CHUNK_OVERLAP,
)


def load_audio(file_path: str) -> np.ndarray:
    """
    Load an audio file as mono audio at the target sample rate.
    """

    audio, _ = librosa.load(
        file_path,
        sr=SAMPLE_RATE,
        mono=True,
    )

    return audio.astype(np.float32)


def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """
    Normalize waveform amplitude.
    """

    max_amplitude = np.max(np.abs(audio))

    if max_amplitude == 0:
        return audio

    return audio / max_amplitude


def remove_silence(audio: np.ndarray) -> np.ndarray:
    """
    Remove leading and trailing silence.
    """

    trimmed_audio, _ = librosa.effects.trim(
        audio,
        top_db=30,
    )

    return trimmed_audio


def preprocess_audio(file_path: str) -> np.ndarray:
    """
    Complete preprocessing pipeline.

    Audio file
        ↓
    Load as mono 16 kHz
        ↓
    Remove silence
        ↓
    Normalize
        ↓
    Return waveform
    """

    audio = load_audio(file_path)

    audio = remove_silence(audio)

    audio = normalize_audio(audio)

    return audio


def create_chunks(audio: np.ndarray) -> list[np.ndarray]:
    """
    Split audio into overlapping chunks.

    Default:
        Chunk duration = 3 seconds
        Overlap = 1 second
    """

    chunk_size = int(CHUNK_DURATION * SAMPLE_RATE)
    overlap_size = int(CHUNK_OVERLAP * SAMPLE_RATE)

    step_size = chunk_size - overlap_size

    chunks = []

    if len(audio) <= chunk_size:
        chunks.append(audio)
        return chunks

    for start in range(0, len(audio) - chunk_size + 1, step_size):

        end = start + chunk_size

        chunk = audio[start:end]

        chunks.append(chunk)

    # Include remaining audio if it is large enough
    remaining_start = len(audio) - chunk_size

    if remaining_start > 0:
        last_chunk = audio[remaining_start:]

        if not np.array_equal(last_chunk, chunks[-1]):
            chunks.append(last_chunk)

    return chunks