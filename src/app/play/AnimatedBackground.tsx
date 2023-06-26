import { AnimateKeyframes } from "react-simple-animate";
import animatedBackgroundStyles from "./animatedBackground.module.css";

export const AnimatedBackground = () => (
  <>
    {/* Top left radial gradient */}
    <AnimateKeyframes
      play
      iterationCount="infinite"
      direction="alternate"
      easeType="ease-in-out"
      duration={10}
      keyframes={[
        { 0: "opacity: 0.6" },
        { 70: "opacity: 0.9" },
        { 100: "opacity: 1" },
      ]}
      render={({ style }) => {
        return (
          <div className={animatedBackgroundStyles.radial1} style={style} />
        );
      }}
    />
    {/* Moving radial gradient */}
    <AnimateKeyframes
      play
      iterationCount="infinite"
      direction="alternate"
      easeType="linear"
      duration={8}
      keyframes={[
        { 0: "opacity: 0.4" },
        { 50: "opacity: 0.8" },
        { 100: "opacity: 0.5" },
      ]}
      render={({ style }) => {
        return (
          <div
            className={animatedBackgroundStyles.radial2}
            style={style}
          />
        );
      }}
    />
    {/* Bottom right linear gradient */}
    <AnimateKeyframes
      play
      iterationCount="infinite"
      direction="alternate"
      easeType="ease-in-out"
      duration={5}
      keyframes={[
        { 0: "opacity: 0.75" },
        { 30: "opacity: 0.9" },
        { 100: "opacity: 1" },
      ]}
      render={({ style }) => {
        return (
          <div
            className={animatedBackgroundStyles.linear1}
            style={style}
          />
        );
      }}
    />
  </>
);
