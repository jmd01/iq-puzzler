"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { TopSection } from "./level/[id]/TopSection";
import { AnimatedBackground } from "./level/components/AnimatedBackground";
import gameAreaStyles from "./level/styles/gameArea.module.css";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameAreaDims, gameAreaRef } = useSetGameArea();
  const { audioContextRef, hasMusic, toggleMusic } = useMusic();

  return (
    <div
      ref={gameAreaRef}
      className={gameAreaStyles.gameArea}
      style={{
        width: gameAreaDims.width,
        height: gameAreaDims.height,
      }}
      onClick={() => {
        audioContextRef.current?.resume();
      }}
    >
      <AnimatedBackground />
      <TopSection hasMusic={hasMusic} toggleMusic={toggleMusic} />
      {children}
    </div>
  );
}

const useSetGameArea = () => {
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

  return {
    gameAreaRef,
    gameAreaDims,
  };
};

const useMusic = () => {
  const [hasMusic, setHasMusic] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem("hasMusic") === "true"
  );

  const toggleMusic = useCallback(() => {
    setHasMusic(!hasMusic);
    localStorage.setItem("hasMusic", String(!hasMusic));

    if (audioContextRef.current && gainNodeRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(
        hasMusic ? 0.0000001 : 1.0,
        audioContextRef.current.currentTime + 1
      );
    }
  }, [hasMusic]);

  const audioContextRef = useRef<AudioContext>();
  const audioNodeRef = useRef<AudioBufferSourceNode>();
  const gainNodeRef = useRef<GainNode>();

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

              gainNodeRef.current = audioContextRef.current.createGain();
              gainNodeRef.current.gain.value = 0.01;

              audioNodeRef.current.connect(gainNodeRef.current);
              gainNodeRef.current.connect(audioContextRef.current.destination);

              // Start playing
              audioNodeRef.current.start();

              if (hasMusic) {
                // Fade in
                gainNodeRef.current.gain.exponentialRampToValueAtTime(
                  1.0,
                  audioContextRef.current.currentTime + 4
                );
              }
            }
          });
        });
    }

    return () => audioNodeRef.current?.stop();

    // Only run on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    audioContextRef,
    hasMusic,
    toggleMusic,
  };
};
