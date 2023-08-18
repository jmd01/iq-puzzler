"use client";
import { useEffect, useRef } from "react";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioContextRef = useRef<AudioContext>();
  const audioNodeRef = useRef<AudioBufferSourceNode>();

  // Create audioand fade it in on first level loaded. Audio will loop seamlessly and will continue playing on transistioning between levels
  // TODO If loading straight to a level page (rather than from the home page), Google will prevent audio from playing since no user interactions have taken place
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();

      // Fetch and buffer the audio - allows for seamless looping
      fetch("/blur.mp3", { mode: "cors" })
        .then(function (resp) {
          return resp.arrayBuffer();
        })
        .then((buffer) => {
          audioContextRef.current?.decodeAudioData(buffer, (decodedBuffer) => {
            if (audioContextRef.current) {

              audioNodeRef.current =
                audioContextRef.current.createBufferSource();
              audioNodeRef.current.buffer = decodedBuffer; 
              audioNodeRef.current.loop = true;

              const gainNode = audioContextRef.current.createGain();
              gainNode.gain.value = 0.01;

              audioNodeRef.current.connect(gainNode);
              gainNode.connect(audioContextRef.current.destination);

              // Start playing
              audioNodeRef.current.start();

              // Fade in
              gainNode.gain.exponentialRampToValueAtTime(
                1.0,
                audioContextRef.current.currentTime + 4
              );
            }
          });
        });
    }

    return () => audioNodeRef.current?.stop();
  }, []);

  return <>{children}</>;
}
