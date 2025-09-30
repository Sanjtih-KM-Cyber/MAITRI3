import { useState, useRef, RefObject } from 'react';

export interface StoredMedia {
  id: string;
  timestamp: number;
  type: 'video' | 'photo';
  duration?: number; // for video
}

export const useLocalMediaStore = (videoRef: RefObject<HTMLVideoElement>) => {
  const [isRecording, setIsRecording] = useState(false);
  const [savedMedia, setSavedMedia] = useState<StoredMedia[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number>(0);

  const startVideoRecording = async () => {
    if (!videoRef.current?.srcObject || !(videoRef.current.srcObject instanceof MediaStream)) {
      alert("Media stream not available. Please ensure camera permissions are enabled.");
      return;
    }

    try {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
            videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const duration = (Date.now() - recordingStartRef.current) / 1000;
        const newMedia: StoredMedia = {
            id: `vid-${Date.now()}`,
            timestamp: Date.now(),
            type: 'video',
            duration: Math.round(duration),
        };
        setSavedMedia(prev => [newMedia, ...prev]);
        // Note: In a real app, you would upload the blob: const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      };

      mediaRecorderRef.current.start();
      recordingStartRef.current = Date.now();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording.");
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    startVideoRecording,
    stopVideoRecording,
    savedMedia,
  };
};
