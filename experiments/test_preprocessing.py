from backend.preprocessing.audio import (
    preprocess_audio,
    create_chunks,
)

from backend.config import SAMPLE_RATE


AUDIO_FILES = [
    "data/test_audio/sample.wav",
    "data/test_audio/sample.mp3",
]


for audio_file in AUDIO_FILES:

    print()
    print("=" * 60)
    print(f"TESTING: {audio_file}")
    print("=" * 60)

    try:

        audio = preprocess_audio(audio_file)

        print(f"Sample rate: {SAMPLE_RATE} Hz")
        print(f"Number of samples: {len(audio)}")

        duration = len(audio) / SAMPLE_RATE

        print(f"Duration: {duration:.2f} seconds")

        chunks = create_chunks(audio)

        print(f"Number of chunks: {len(chunks)}")

        for i, chunk in enumerate(chunks):

            chunk_duration = len(chunk) / SAMPLE_RATE

            print(
                f"Chunk {i + 1}: "
                f"{len(chunk)} samples | "
                f"{chunk_duration:.2f} seconds"
            )

        print("STATUS: SUCCESS")

    except Exception as error:

        print("STATUS: FAILED")
        print(f"Error: {error}")


print()
print("=" * 60)
print("AUDIO FORMAT TEST COMPLETE")
print("=" * 60)