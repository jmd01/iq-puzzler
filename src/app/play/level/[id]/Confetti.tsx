import { useCallback } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

export const Confetti = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadConfettiPreset(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      container?.start();
      container?.play();
    },
    []
  );

  const emitters = [
    {
      life: {
        duration: 5,
        count: 1,
      },
      position: {
        x: 0,
        y: 30,
      },
      particles: {
        move: {
          direction: "top-right",
        },
      },
    },
    {
      life: {
        duration: 5,
        count: 1,
      },
      position: {
        x: 100,
        y: 30,
      },
      particles: {
        move: {
          direction: "top-left",
        },
      },
    },
  ];

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        preset: "confetti",
        fullScreen: {
          enable: true,
        },
        emitters: Array(5).fill(emitters).flat(),
        detectRetina: true,
      }}
    />
  );
};
