
import { Blob } from '@google/genai';

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  // Create 2.5 seconds of noise (reduced from 6s)
  const bufferSize = ctx.sampleRate * 2.5; 
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playWind(ctx: AudioContext, now: number) {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 1;
  
  const gain = ctx.createGain();
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  // Wind envelope: smooth fade in and fade out
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
  
  // Filter sweep for breeze effect
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.linearRampToValueAtTime(600, now + 1.2); 
  filter.frequency.linearRampToValueAtTime(200, now + 2.5);
  
  noise.start(now);
  noise.stop(now + 2.6);
}

function playBirdChirp(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  // Bird sound characteristics (Sine wave with rapid frequency drop)
  osc.type = 'sine';
  const startFreq = 2000 + Math.random() * 1000;
  osc.frequency.setValueAtTime(startFreq, time);
  osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, time + 0.1);
  
  // Short chirp envelope
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.05, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  
  osc.start(time);
  osc.stop(time + 0.2);
}

function playMelody(ctx: AudioContext, now: number) {
  // Faster Pastoral Pentatonic sequence (C Major Pentatonic)
  const notes = [
      { freq: 261.63, time: 0.2 }, // C4
      { freq: 293.66, time: 0.4 }, // D4
      { freq: 329.63, time: 0.6 }, // E4
      { freq: 392.00, time: 0.8 }, // G4
      { freq: 440.00, time: 1.0 }, // A4
      { freq: 523.25, time: 1.4 }  // C5 (Final resolve)
  ];

  notes.forEach(({ freq, time }) => {
    const t = now + time;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Triangle wave filtered to sound flute-like
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    // Slight lowpass to soften the triangle wave
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    // Smooth envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.05); // Faster attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0); // Shorter tail
    
    osc.start(t);
    osc.stop(t + 1.2);
  });
}

function playStartupSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  
  // Resume context if suspended (common in browsers)
  if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  
  // Layer 1: Ambient Wind
  playWind(ctx, now);

  // Layer 2: Gentle Melody
  playMelody(ctx, now);
  
  // Layer 3: Random Birds (Reduced count)
  playBirdChirp(ctx, now + 0.5 + Math.random() * 0.2);
  playBirdChirp(ctx, now + 1.2 + Math.random() * 0.2);
}

export const audioUtils = {
  encode,
  decode,
  decodeAudioData,
  createBlob,
  playStartupSound,
};
