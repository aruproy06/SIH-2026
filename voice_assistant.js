/**
 * VisionWare AI - Multilingual Voice AI Assistant (Innovation)
 * Web Speech API Integration for English, Hindi, and Bengali.
 */

class VoiceAIAssistant {
  constructor(options = {}) {
    this.currentLanguage = 'en-IN';
    this.isListening = false;
    this.recognition = null;
    this.onResultCallback = options.onResult || null;
    this.onStateChangeCallback = options.onStateChange || null;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.currentLanguage;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      this.recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("🎤 Voice Transcript:", transcript);
        await this.handleTranscript(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn("Voice Recognition Notice:", event.error);
        this.isListening = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };
    } else {
      console.warn("Web Speech API not supported in this browser. Fallback to button commands.");
    }
  }

  setLanguage(langCode) {
    if (langCode === 'hi') this.currentLanguage = 'hi-IN';
    else if (langCode === 'bn') this.currentLanguage = 'bn-IN';
    else this.currentLanguage = 'en-IN';

    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert("Speech recognition is active in Chrome/Edge browsers. You can also click the quick voice command chips below!");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        console.error("Speech start error:", e);
      }
    }
  }

  async handleTranscript(transcript) {
    try {
      const response = await fetch('/api/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_transcript: transcript,
          language: this.currentLanguage.split('-')[0]
        })
      });
      const data = await response.json();
      
      // Speak reply back to user
      this.speak(data.spoken_reply, data.detected_language);

      if (this.onResultCallback) {
        this.onResultCallback(data, transcript);
      }
    } catch (err) {
      console.error("Voice API error:", err);
    }
  }

  speak(text, lang = 'en') {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'bn') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-IN';
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
