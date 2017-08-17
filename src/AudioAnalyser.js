import * as utils from './utils';

/**
 * 音频分析器
 *
 * @class
 */

class AudioAnalyser {

  constructor(audio, fftSize) {
    this.analyser = audio.context.createAnalyser();
    this.analyser.fftSize = fftSize || 2048;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);

    audio.gainNode.connect(this.analyser);
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.data);

    return this.data;
  };

  getAverageFrequency() {
    let value = 0;
    let data = this.getFrequencyData();

    for (let i = 0; i < data.length; i ++) {
      value += data[i];
    }

    return value / data.length;

  };
}

export default AudioAnalyser;
