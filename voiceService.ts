// A wrapper for the Web Speech API to handle voice recognition.
// Note: Browser support for SpeechRecognition can be inconsistent.

interface CustomSpeechRecognition extends SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

class VoiceService {
  private recognition: CustomSpeechRecognition | null = null;
  private isListening = false;
  private onResultCallback: ((transcript: string) => void) | null = null;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition() as CustomSpeechRecognition;
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        if (this.onResultCallback) {
          this.onResultCallback(transcript);
        }
      };

      // Automatically restart listening when it ends
      this.recognition.onend = () => {
        if (this.isListening) {
          this.recognition?.start();
        }
      };
    } else {
      console.warn("Speech Recognition not supported by this browser.");
    }
  }

  startListening(onResult: (transcript: string) => void): void {
    if (this.recognition && !this.isListening) {
      this.onResultCallback = onResult;
      this.isListening = true;
      try {
        this.recognition.start();
      } catch (e) {
        console.error("Voice listener failed to start:", e);
        this.isListening = false;
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      this.onResultCallback = null;
    }
  }

  startDictation(onResult: (transcript: string) => void, onEnd: () => void) {
     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
     if (SpeechRecognition) {
        // Stop global listener if it's running
        const wasListening = this.isListening;
        if(wasListening) this.stopListening();

        const dictationRecognition = new SpeechRecognition() as CustomSpeechRecognition;
        dictationRecognition.continuous = true; // Continuous for longer dictation
        dictationRecognition.interimResults = true;
        dictationRecognition.lang = 'en-US';

        let finalTranscript = '';
        dictationRecognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            onResult(finalTranscript + interimTranscript);
        };
        dictationRecognition.onend = () => {
            onEnd();
            // Restart global listener if it was running before
            if (wasListening && this.onResultCallback) this.startListening(this.onResultCallback);
        };

        dictationRecognition.start();
        return dictationRecognition;
     }
     return null;
  }
  
  speak(text: string, onEnd?: () => void) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech to prevent overlap
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      if (onEnd) {
        utterance.onend = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported by this browser.");
    }
  }
}

export const voiceService = new VoiceService();
