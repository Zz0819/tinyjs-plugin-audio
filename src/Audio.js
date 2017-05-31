import utils from './utils';

/**
 * 音效类
 *
 * @class
 * @extends Tiny.EventEmitter
 */
class Audio extends Tiny.EventEmitter {
  /**
   *
   * @param {AudioBuffer|HTMLAudioElement}  data    音效数据
   * @param {Tiny.audio.manager}       manager 音效管理对象
   */
  constructor(data, manager) {
    super();

    /**
     * 音效管理对象
     *
     * @member {Tiny.audio.manager}
     */
    this.manager = manager;

    /**
     * 音效数据
     * @member {AudioBuffer|HTMLAudioElement}
     */
    this.data = data;

    if (!utils.isWebAudioSupported) {
      this.audio = new window.Audio();
      this.audio.addEventListener('ended', this._onEnd.bind(this));
    }

    this.reset();
  }

  /**
   * 播放音效
   *
   * @param {boolean}  pause  是否从暂停点播放
   * @return {Tiny.audio.com.Audio}
   */
  play(pause) {
    if ((!pause && this.paused) || (!pause && this.playing)) return this;
    this.playing = true;
    this.emit('play');

    if (utils.isWebAudioSupported) {
      this.audio = this.manager.context.createBufferSource();
      this.audio.start = this.audio.start || this.audio.noteOn;
      this.audio.stop = this.audio.stop || this.audio.noteOff;

      this.audio.buffer = this.data;
      this.audio.loop = this.loop;
      this._startTime = this.manager.context.currentTime;

      this.audio.onended = this._onEnd.bind(this);
      this.audio.gainNode = utils.createGainNode(this.manager.context);
      this.audio.gainNode.connect(this.manager.gainNode);

      this.audio.connect(this.audio.gainNode);
      this.audio.start(0, pause ? this._lastPauseTime : null);
    } else {
      this.audio.src = this.data.children[0].src;
      this.audio.preload = 'auto';
      this.audio.load();
      this.audio.play();
    }

    return this;
  }

  /**
   * 停止播放音效
   *
   * @return {Tiny.audio.com.Audio}
   */
  stop() {
    if (!this.playing) return this;

    if (utils.isWebAudioSupported) {
      this.audio.stop(0);
    } else {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.playing = false;
    this.emit('stop');

    return this;
  }

  /**
   * 重置音效
   */
  reset() {
    this._startTime = 0;
    this._lastPauseTime = 0;
    this._offsetTime = 0;

    this.playing = false;
    //if(utils.isWebAudioSupported)this.audio = null;
  }

  /**
   * 将自己从 `Tiny.audio.manager` 的实例对象中移除
   */
  remove() {
    this.manager.removeAudio(this);
  }

  _onEnd() {
    if (!utils.isWebAudioSupported) {
      if (this.loop) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.reset();
        this.emit('end');
      }
    } else {
      if (!this.paused) {
        this.reset();
        this.emit('end');
      }
    }
  }

  /**
   * 是否被暂停了
   *
   * > Tips:
   * > 如果要设置音效暂停，直接设置这个`Tiny.Audio`实例的`paused`属性，即：`music.paused = true;`。
   * > 再播放时可以从暂停点接着播放了：`music.play(true);`
   *
   * @member {Tiny.audio.com.Audio}
   * @default false
   */
  get paused() {
    return this._paused;
  }

  set paused(value) {
    if (value === this._paused) return;
    if (value) {
      if (utils.isWebAudioSupported) {
        this._offsetTime += this.manager.context.currentTime - this._startTime;
        this._lastPauseTime = this._offsetTime % this.audio.buffer.duration;
        if (this.audio) this.audio.stop(0);
      } else {
        if (this.audio) this.audio.pause();
      }
      this.emit('pause');
    } else {
      if (utils.isWebAudioSupported) {
        this.play(true);
      } else {
        if (this.audio) this.audio.play();
      }
      this.emit('resume');
    }
    this._paused = value;
  }

  /**
   * 是否循环播放
   *
   * @member {Tiny.audio.com.Audio}
   * @default false
   */
  get loop() {
    return this._loop;
  }

  set loop(value) {
    if (value === this._loop) return;
    this._loop = value;
    if (utils.isWebAudioSupported && this.audio) {
      this.audio.loop = value;
    }
  }
}

Audio.prototype._loop = false;
Audio.prototype._paused = false;
Audio.prototype._startTime = 0;
Audio.prototype._lastPauseTime = 0;
Audio.prototype._offsetTime = 0;

/**
 * 音效是否正在播放
 *
 * @member {boolean}
 * @readonly
 */
Audio.prototype.playing = false;

export default Audio;
