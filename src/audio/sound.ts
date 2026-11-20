import { ui } from '../content';
import { clamp } from '../core/math';

type SoundState = 'pending' | 'on' | 'off';
const KEY = 'tour-sound';

/** A-minor pentatonic, one bell per stop, rising as you go deeper. */
const BELLS = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

/**
 * Generative WebAudio soundscape, no audio files:
 *  - a drone that opens up (filter + upper voices) as you go deeper,
 *  - wind (filtered noise) that rises with swipe speed,
 *  - a bell on every landing.
 * On by default but "pending" until the first click, tap or key press.
 * "Off" is remembered in localStorage.
 */
export class Soundscape {
  state: SoundState = 'pending';
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private droneFilter!: BiquadFilterNode;
  private upper!: GainNode;
  private windGain!: GainNode;
  private windFilter!: BiquadFilterNode;
  private bellBus!: GainNode;
  private btn: HTMLButtonElement | null;
  private label: HTMLElement | null;

  constructor() {
    this.btn = document.querySelector<HTMLButtonElement>('.sound-btn');
    this.label = this.btn?.querySelector<HTMLElement>('.sound-btn__label') ?? null;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    this.state = stored === 'off' ? 'off' : 'pending';
    this.render();

    const firstGesture = (e: Event) => {
      if (this.btn && e.target instanceof Node && this.btn.contains(e.target)) return; // the button handles itself
      if (this.state === 'pending') this.enable();
    };
    const opts = { capture: true, once: false } as const;
    const gestures = ['pointerup', 'keydown', 'touchend'] as const;
    const off = () => gestures.forEach((g) => window.removeEventListener(g, handler, opts));
    const handler = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.key === 'Tab' || e.key === 'Shift')) return;
      firstGesture(e);
      if (this.state !== 'pending') off();
    };
    gestures.forEach((g) => window.addEventListener(g, handler, opts));

    this.btn?.addEventListener('click', () => {
      if (this.state === 'on') this.disable();
      else this.enable();
      off();
    });

    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) void this.ctx.suspend();
      else if (this.state === 'on') void this.ctx.resume();
    });
  }

  private render() {
    if (!this.btn || !this.label) return;
    this.btn.dataset.state = this.state;
    this.btn.setAttribute('aria-pressed', String(this.state === 'on'));
    if (this.state === 'pending') {
      this.label.innerHTML = `<span class="only-pointer">${ui.sound.pendingPointer}</span><span class="only-touch">${ui.sound.pendingTouch}</span>`;
    } else {
      this.label.textContent = this.state === 'on' ? ui.sound.on : ui.sound.off;
    }
  }

  private enable() {
    this.state = 'on';
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage blocked */
    }
    this.render();
    if (!this.ctx) this.build();
    if (!this.ctx) return;
    void this.ctx.resume();
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0.75, now, 0.8);
  }

  private disable() {
    this.state = 'off';
    try {
      localStorage.setItem(KEY, 'off');
    } catch {
      /* storage blocked */
    }
    this.render();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0, now, 0.15);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (this.state === 'off') void ctx.suspend();
    }, 700);
  }

  private build() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    comp.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);

    // Drone
    this.droneFilter = ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.value = 260;
    this.droneFilter.Q.value = 0.8;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.12;
    this.droneFilter.connect(droneGain).connect(this.master);
    const voice = (type: OscillatorType, freq: number, detune: number, gain: number, dest: AudioNode) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = gain;
      o.connect(g).connect(dest);
      o.start();
      return o;
    };
    voice('sawtooth', 55, -6, 0.5, this.droneFilter);
    voice('sawtooth', 55, 7, 0.5, this.droneFilter);
    voice('sine', 110, 0, 0.6, this.droneFilter);
    this.upper = ctx.createGain();
    this.upper.gain.value = 0;
    this.upper.connect(this.droneFilter);
    voice('triangle', 164.81, 3, 0.35, this.upper);
    voice('triangle', 220, -4, 0.25, this.upper);
    voice('sine', 329.63, 0, 0.15, this.upper);
    // Slow filter breathing
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(this.droneFilter.frequency);
    lfo.start();

    // Wind
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 500;
    this.windFilter.Q.value = 0.7;
    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0;
    noise.connect(this.windFilter).connect(this.windGain).connect(this.master);
    noise.start();

    // Bells with a short shimmering echo
    this.bellBus = ctx.createGain();
    this.bellBus.gain.value = 0.32;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.27;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 3200;
    this.bellBus.connect(this.master);
    this.bellBus.connect(delay);
    delay.connect(tone).connect(fb).connect(delay);
    tone.connect(this.master);
  }

  /** depth 0..1 through the tour, speed 0..1 swipe speed. */
  update(depth: number, speed: number) {
    if (!this.ctx || this.state !== 'on') return;
    const now = this.ctx.currentTime;
    this.droneFilter.frequency.setTargetAtTime(240 + Math.pow(depth, 1.4) * 1900, now, 0.4);
    this.upper.gain.setTargetAtTime(0.15 + depth * 0.85, now, 0.6);
    this.windGain.gain.setTargetAtTime(clamp(speed) * 0.2, now, 0.12);
    this.windFilter.frequency.setTargetAtTime(380 + speed * 1500, now, 0.15);
  }

  bell(index: number) {
    if (!this.ctx || this.state !== 'on') return;
    const ctx = this.ctx;
    const f0 = BELLS[index % BELLS.length];
    const now = ctx.currentTime + 0.01;
    const partials: [number, number, number][] = [
      [1, 0.5, 2.4],
      [2.0, 0.16, 1.5],
      [2.76, 0.12, 1.0],
      [5.4, 0.05, 0.55],
    ];
    for (const [ratio, amp, decay] of partials) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f0 * ratio;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(amp, now + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      o.connect(g).connect(this.bellBus);
      o.start(now);
      o.stop(now + decay + 0.05);
    }
  }
}
