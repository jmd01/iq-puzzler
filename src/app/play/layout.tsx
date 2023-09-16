"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TopSection } from "./level/[id]/TopSection";
import { AnimatedBackground } from "./level/components/AnimatedBackground";
import gameAreaStyles from "./level/styles/gameArea.module.css";
import { GameContext } from "./GameContext";
import { useResizeDetector } from "react-resize-detector";
import { usePrevious } from "./hooks/usePrevious";
import { boolean } from "zod";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    width,
    height,
    ref: gameAreaRef,
  } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 200,
    onResize: (width, height) => {
      if (width && height && cellSize && prev?.width && prev?.height)
        location.reload();
    },
  });

  const prev = usePrevious<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width,
    height,
  });

  const { audioContextRef, hasMusic, toggleMusic, hasFx, toggleFx } =
    useAudio();

  const cellSize = useMemo(() => {
    if (!(width && height)) {
      return 0;
    }
    switch (true) {
      case width < 400:
        return height < 700 ? 24 : 28;
      case width < 600:
        return height < 700 ? 30 : 34;
      case width < 800:
        return height < 890 ? 40 : 44;
      case width < 1000:
        return height < 900 ? 42 : 50;
      case width < 1200:
        return height < 980 ? 48 : 56;
      case width < 1500:
        return height < 930 ? 54 : 62;
      default:
        return height < 880 ? 58 : 64;
    }
  }, [width, height]);

  const value = useMemo(
    () => ({
      cellSize,
      width: width || 0,
      height: height || 0,
      hasFx,
      toggleFx,
    }),
    [cellSize, hasFx, height, width]
  );

  return (
    <GameContext.Provider value={value}>
      <div
        ref={gameAreaRef}
        className={gameAreaStyles.gameArea}
        style={{
          width: "100%",
          height: "100%",
        }}
        onClick={() => {
          audioContextRef.current?.resume();
        }}
      >
        <AnimatedBackground />
        <TopSection
          hasMusic={hasMusic}
          toggleMusic={toggleMusic}
          hasFx={hasFx}
          toggleFx={toggleFx}
        />
        {width && height && cellSize ? children : null}
      </div>
    </GameContext.Provider>
  );
}

const useAudio = () => {
  const [hasMusic, setHasMusic] = useState(
    typeof window !== "undefined" && window.localStorage.getItem("hasMusic")
      ? window.localStorage.getItem("hasMusic") === "true"
        ? true
        : false
      : true
  );
  const [hasFx, setHasFx] = useState(
    typeof window !== "undefined" && window.localStorage.getItem("hasFx")
      ? window.localStorage.getItem("hasFx") === "true"
        ? true
        : false
      : true
  );

  const toggleFx = useCallback(() => {
    setHasFx(!hasFx);
    localStorage.setItem("hasFx", String(!hasFx));
  }, [hasFx]);

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
    hasFx,
    toggleFx,
  };
};
