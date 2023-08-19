"use client";
import { useEffect, useRef, useState } from "react";
import { TopSection } from "./level/[id]/TopSection";
import { AnimatedBackground } from "./level/components/AnimatedBackground";
import gameAreaStyles from "./level/styles/gameArea.module.css";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [gameAreaDims, setGameAreaDims] = useState<{
    width: number | string;
    height: number | string;
  }>({
    height: "100%",
    width: "100%",
  });

  // Fix the window size to 100% on first load
  useEffect(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current?.getBoundingClientRect();
      setGameAreaDims({
        width,
        height,
      });
    }
  }, []);

  const audioContextRef = useRef<AudioContext>();
  const audioNodeRef = useRef<AudioBufferSourceNode>();

  // Create audio and fade it in on first level loaded. Audio will loop seamlessly and will continue playing on transitioning between levels
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

  return (
    <div
      ref={gameAreaRef}
      className={gameAreaStyles.gameArea}
      style={{
        width: gameAreaDims.width,
        height: gameAreaDims.height,
      }}
    >
      <AnimatedBackground />
      <TopSection />
      {children}
    </div>
  );
}
