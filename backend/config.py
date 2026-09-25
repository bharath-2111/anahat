# Audio configuration
SAMPLE_RATE = 16000  #16KHz
CHANNELS = 1

# Analysis configuration
CHUNK_DURATION = 3  # 3 sec window
CHUNK_OVERLAP = 1

# Initial prototype threshold
SPOOF_THRESHOLD = 0.75  #

# Temporal detection
REQUIRED_SPOOF_CHUNKS = 3   #abnormal window not to immediately trigger the strongest alert


#this file consists of the audio preproccessing before the wav2vec can see the audio the functions that are done is 
#1) load audio input.wav  input.wav ->librosa->mono->16KHz
#2) remove silence from the audio
#3) normalize audio between -1 and 1
#4) chunking the audio into 3 second chunks with 1 second overlap



