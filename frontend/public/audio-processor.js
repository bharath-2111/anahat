class LiveAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(0);
    // Send transport blocks of 1600 samples (~100 ms at 16 kHz)
    this.blockSize = 1600;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0]; // Mono input frame
      if (channelData && channelData.length > 0) {
        const newBuffer = new Float32Array(this.buffer.length + channelData.length);
        newBuffer.set(this.buffer);
        newBuffer.set(channelData, this.buffer.length);
        this.buffer = newBuffer;

        while (this.buffer.length >= this.blockSize) {
          const chunk = this.buffer.slice(0, this.blockSize);
          this.port.postMessage(chunk.buffer, [chunk.buffer]);
          this.buffer = this.buffer.slice(this.blockSize);
        }
      }
    }
    return true;
  }
}

registerProcessor('live-audio-processor', LiveAudioProcessor);
