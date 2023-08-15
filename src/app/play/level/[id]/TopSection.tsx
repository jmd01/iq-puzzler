import { useState } from "react";
import Logo from "../components/Logo";
import gameAreaStyles from "../styles/gameArea.module.css";
import {
  faMusic,
  faQuestion,
  faQuestionCircle,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TopSection = () => {
  const [hasMusic, setHasMusic] = useState(false);
  const [hasFx, setHasFx] = useState(false);
  const [isOpenHelp, setIsOpenHelp] = useState(false);
  const [hoverMusic, setHoverMusic] = useState(false);
  const [hoverFx, setHoverFx] = useState(false);
  const [hoverHelp, setHoverHelp] = useState(false);

  return (
    <div className={gameAreaStyles.topSection}>
      <div className={gameAreaStyles.logoContainer}>
        <Logo fill="#3a287a" width={80} />
      </div>
      <div className={gameAreaStyles.toolbar}>
        <button
          onClick={() => setHasMusic(!hasMusic)}
          onMouseEnter={() => setHoverMusic(!hasMusic)}
          onMouseLeave={() => setHoverMusic(hasMusic)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faMusic}
            color={hasMusic || hoverMusic ? "#3a2879" : "#2d1976"}
          />
        </button>
        <button
          onClick={() => setHasFx(!hasFx)}
          onMouseEnter={() => setHoverFx(!hasFx)}
          onMouseLeave={() => setHoverFx(hasFx)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faVolumeOff}
            color={hasFx || hoverFx ? "#3a2879" : "#2d1976"}
          />
        </button>
        <button
          onClick={() => setIsOpenHelp(!isOpenHelp)}
          onMouseEnter={() => setHoverHelp(!isOpenHelp)}
          onMouseLeave={() => setHoverHelp(isOpenHelp)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            color={isOpenHelp || hoverHelp ? "#3a2879" : "#2d1976"}
          />
        </button>
        <div className={gameAreaStyles.helpTooltip}>help</div>
      </div>
    </div>
  );
};
