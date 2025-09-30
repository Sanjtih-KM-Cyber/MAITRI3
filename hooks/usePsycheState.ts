import { useState, useEffect, useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';

// Declare global variables from the CDN scripts
declare const tf: any;
declare const faceLandmarksDetection: any;

interface WellnessState {
  stress: number; // 0-100
  fatigue: number; // 0-100
}

export const usePsycheState = () => {
  const { videoRef } = useContext(AppStateContext);
  const [wellness, setWellness] = useState<WellnessState>({ stress: 0, fatigue: 0 });
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef) return;
    
    let model: any;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let mediaStream: MediaStream;
    let animationFrameId: number;

    let retryCount = 0;
    const maxRetries = 10; // Wait up to 5 seconds

    const setup = async () => {
      if (!videoRef.current) return;

      // FIX: Poll for global scripts to prevent race condition.
      // Check for SupportedPackages to ensure the model library is fully initialized.
      if (typeof tf === 'undefined' || typeof faceLandmarksDetection === 'undefined' || !faceLandmarksDetection.SupportedPackages) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(setup, 500); // Retry after 500ms
          return;
        } else {
          setError("Failed to load AI models. Please check your connection and refresh.");
          setIsInitializing(false);
          return;
        }
      }

      try {
        // 1. Set TF backend and load model
        await tf.setBackend('webgl');
        model = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          { maxFaces: 1 } // Optimize for single user
        );

        // 2. Get Media Permissions
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 120, height: 120 },
          audio: true,
        });

        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play(); // Ensure video is playing for analysis

        // 3. Setup Audio Analysis
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(mediaStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        setIsInitializing(false);
        setError(null);
        analyze();

      } catch (err) {
        console.error("Error setting up PsycheState:", err);
        setError("Could not access camera or microphone. Please check permissions.");
        setIsInitializing(false);
      }
    };

    const analyze = async () => {
      if (videoRef.current && videoRef.current.readyState >= 3 && model && analyser) {
        // --- Facial Analysis for Stress ---
        const predictions = await model.estimateFaces({ input: videoRef.current });
        let stressScore = 0;
        if (predictions.length > 0) {
          const keypoints = predictions[0].scaledMesh;
          
          // Brow furrow detection (distance between inner eyebrows)
          const p1 = keypoints[55]; 
          const p2 = keypoints[285];
          const browDistance = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
          // Normalize based on observation: ~30 is relaxed, <15 is furrowed
          const browFurrow = Math.max(0, 1 - (browDistance / 30)); 

          // Jaw tension detection (vertical distance between lips)
          const p3 = keypoints[13]; // Upper lip
          const p4 = keypoints[14]; // Lower lip
          const lipDistance = Math.abs(p3[1] - p4[1]);
          // Normalize: ~5 is relaxed, <1 is tense
          const jawTension = Math.max(0, 1 - (lipDistance / 5));

          // Combine metrics. Brow furrow is a stronger indicator.
          stressScore = Math.min(100, (browFurrow * 70) + (jawTension * 30)) * 100;
        }

        // --- Vocal Analysis for Fatigue ---
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        let total = 0;
        // Analyze lower-mid frequencies, common in human voice
        for (let i = 0; i < dataArray.length / 2; i++) {
          total += dataArray[i];
        }
        const avgFrequency = total / (dataArray.length / 2);
        // Normalize: Healthy voice is ~80-100, fatigued/low is < 50
        const fatigueScore = Math.min(100, (1 - (avgFrequency / 100)) * 100);

        setWellness({
            stress: Math.max(0, Math.min(100, stressScore)),
            fatigue: Math.max(0, Math.min(100, fatigueScore)),
        });
      }
      animationFrameId = requestAnimationFrame(analyze);
    };

    setup();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [videoRef]);

  return { wellness, isInitializing, error };
};
