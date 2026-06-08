/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/api/patient/voice.api.js
import api from '../api';

const VOICE_BASE = '/voice';

// ── REST ──────────────────────────────────────────────────────────────────────

export const voiceAPI = {

  getSpecialists: async () => {
    const res = await api.get(`${VOICE_BASE}/specialists`);
    return res.data;
  },

  // REPLACE startSession with:
  startSession: async ({
    specialist_type,
    language = 'en',
    resume_context               = undefined,
    resumed_from_consultation_id = undefined,
  }) => {
    const body = { specialist_type, language };
    if (resume_context)               body.resume_context               = resume_context;
    if (resumed_from_consultation_id) body.resumed_from_consultation_id = resumed_from_consultation_id;

    const res = await api.post(`${VOICE_BASE}/session/start`, body);
    return res.data;
  },


  endSession: async (sessionToken, payload = {}) => {
    const res = await api.post(`${VOICE_BASE}/session/${sessionToken}/end`, payload);
    return res.data;
  },

  getTranscript: async (sessionId) => {
    const res = await api.get(`${VOICE_BASE}/session/${sessionId}/transcript`);
    return res.data;
  },

  getHistory: async (limit = 20) => {
    const res = await api.get(`${VOICE_BASE}/history`, { params: { limit } });
    return res.data;
  },
};

// ── WebSocket Manager ─────────────────────────────────────────────────────────

export class VoiceWebSocketManager {
  constructor({ wsUrl, onEvent, onAudio, onOpen, onClose, onError }) {
    this.wsUrl      = wsUrl;
    this.onEvent    = onEvent;   // JSON events handler
    this.onAudio    = onAudio;   // Binary audio chunk handler
    this.onOpen     = onOpen;
    this.onClose    = onClose;
    this.onError    = onError;
    this.ws         = null;
    this._connected = false;
  }

  connect() {
    const token = localStorage.getItem('access_token');
    const url   = `${this.wsUrl}?token=${token}`;

    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      this._connected = true;
      this.onOpen?.();
    };

    this.ws.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        // Binary → PCM16 audio from AI
        this.onAudio?.(e.data);
      } else {
        try {
          const event = JSON.parse(e.data);
          this.onEvent?.(event);
        } catch {
          console.warn('Invalid WS message:', e.data);
        }
      }
    };

    this.ws.onclose  = (e) => {
      this._connected = false;
      this.onClose?.(e);
    };

    this.ws.onerror  = (e) => {
      this.onError?.(e);
    };
  }

  // Send PCM16 audio bytes from mic
  sendAudio(arrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(arrayBuffer);
    }
  }

  // Send JSON control event
  sendEvent(payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  // Send text message (no mic fallback)
  sendTextMessage(text) {
    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type:    'message',
        role:    'user',
        content: [{ type: 'input_text', text }],
      },
    });
  }

  commitAudio() {
    this.sendEvent({ type: 'input_audio_buffer.commit' });
  }

  cancelResponse() {
    this.sendEvent({ type: 'response.cancel' });
  }

  endSession() {
    this.sendEvent({ type: 'session.end' });
  }

  disconnect() {
    this._connected = false;
    if (this.ws) {
      this.ws.close(1000, 'User ended session');
      this.ws = null;
    }
  }

  get isConnected() {
    return this._connected && this.ws?.readyState === WebSocket.OPEN;
  }
}

// ── Audio Recorder (PCM16 from mic) ──────────────────────────────────────────

export class MicRecorder {
  constructor({ onAudioChunk, sampleRate = 24000 }) {
    this.onAudioChunk = onAudioChunk;
    this.sampleRate   = sampleRate;
    this.ctx          = null;
    this.stream       = null;
    this.processor    = null;
    this.source       = null;
    this._active      = false;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.ctx    = new AudioContext({ sampleRate: this.sampleRate });
    this.source = this.ctx.createMediaStreamSource(this.stream);

    // ScriptProcessor for PCM16 extraction (works in all browsers)
    this.processor = this.ctx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this._active) return;
      const float32 = e.inputBuffer.getChannelData(0);
      const pcm16   = this._float32ToPcm16(float32);
      this.onAudioChunk?.(pcm16.buffer);
    };

    this.source.connect(this.processor);
    this.processor.connect(this.ctx.destination);
    this._active = true;
  }

  stop() {
    this._active = false;
    this.processor?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach(t => t.stop());
    this.ctx?.close();
    this.processor = null;
    this.source     = null;
    this.stream     = null;
    this.ctx        = null;
  }

  _float32ToPcm16(float32Array) {
    const pcm = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      pcm[i] = Math.max(-32768, Math.min(32767, float32Array[i] * 32768));
    }
    return pcm;
  }

  get isActive() { return this._active; }
}

// ── Audio Player (PCM16 → speaker) ───────────────────────────────────────────

export class AIAudioPlayer {
  // ✅ FIX: accept onPlaybackDone callback
  constructor({ sampleRate = 24000, onPlaybackDone } = {}) {
    this.sampleRate    = sampleRate;
    this.onPlaybackDone = onPlaybackDone;  // ✅ NEW
    this.ctx           = null;
    this._queue        = [];
    this._playing      = false;
  }

  _ensureCtx() {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext({ sampleRate: this.sampleRate });
    }
  }

  enqueue(arrayBuffer) {
    this._ensureCtx();
    const pcm = new Int16Array(arrayBuffer);
    const f32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) f32[i] = pcm[i] / 32768;

    const buf = this.ctx.createBuffer(1, f32.length, this.sampleRate);
    buf.getChannelData(0).set(f32);
    this._queue.push(buf);

    if (!this._playing) this._playNext();
  }

  _playNext() {
    if (!this._queue.length) {
      this._playing = false;
      // ✅ FIX: fire callback when queue fully drained → hook resets to READY
      this.onPlaybackDone?.();
      return;
    }
    this._playing  = true;
    const buf      = this._queue.shift();
    const src      = this.ctx.createBufferSource();
    src.buffer     = buf;
    src.connect(this.ctx.destination);
    src.onended    = () => this._playNext();
    src.start();
  }

  stop() {
    this._queue    = [];
    this._playing  = false;
    this.ctx?.close();
    this.ctx = null;
  }
}