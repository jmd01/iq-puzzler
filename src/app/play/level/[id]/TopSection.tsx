import { useEffect, useRef, useState } from "react";
import Logo from "../components/Logo";
import gameAreaStyles from "../styles/gameArea.module.css";
import {
  faCog,
  faMusic,
  faQuestionCircle,
  faRefresh,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { sigmarOne } from "@/app/fonts";
import Solution from "../components/solution/Solution";
import { Animate } from "react-simple-animate";
import { getLevelDifficulty } from "../utils/utils";
import {
  onButtonClick,
  onButtonHover,
} from "./GameArea/hooks/useEventHandlers";
import { Difficulty } from "../types";
import { LevelSelectorTooltip } from "./LevelSelectorTooltip";
import { ControlsTooltip } from "./ControlsTooltip";

const iconColor = "#352d9d";
const iconActiveColor = "#6e66d7";

export const TopSection = ({
  hasMusic,
  toggleMusic,
  hasFx,
  toggleFx,
  levelId,
  setLevelId,
}: {
  hasMusic: boolean;
  toggleMusic: () => void;
  hasFx: boolean;
  toggleFx: () => void;
  levelId?: number;
  setLevelId: (levelId: number) => void;
}) => {
  const [levelDifficulty, setLevelDifficulty] = useState<Difficulty>();
  const [isOpenControls, setIsOpenControls] = useState(levelId === 1);
  const [isOpenSolution, setIsOpenSolution] = useState(false);
  const [isOpenLevelSelector, setIsOpenLevelSelector] = useState(false);
  const [hoverMusic, setHoverMusic] = useState(false);
  const [hoverFx, setHoverFx] = useState(false);
  const [hoverHelp, setHoverHelp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const paddingTop = ref.current?.offsetHeight || 0;

  useEffect(() => {
    const levelId = Number(
      typeof window !== "undefined"
        ? window.location.pathname.split("/").at(-1)
        : 1
    );
    setLevelId(levelId);
    setLevelDifficulty(getLevelDifficulty(levelId));


    if (levelId === 1) {
      setIsOpenControls(true);
    }
  }, [setLevelId]);

  return (
    <div ref={ref} className={gameAreaStyles.topSection}>
      <div
        className={classnames(
          gameAreaStyles.toolbar,
          gameAreaStyles.toolbarLeft
        )}
      >
        <button
          onClick={() => {
            onButtonClick(hasFx);
            setIsOpenLevelSelector(true);
          }}
          onMouseEnter={() => {
            onButtonHover(hasFx);
          }}
          className={classnames(
            gameAreaStyles.topSectionLevel,
            gameAreaStyles.levelButton,
            sigmarOne.className
          )}
          style={{ color: iconActiveColor }}
        >
          <span>
            L {levelId}
            <br />
            <span style={{ fontSize: "0.8em" }}>{levelDifficulty}</span>
          </span>
        </button>
        {isOpenLevelSelector && (
          <LevelSelectorTooltip
            setIsOpenLevelSelector={setIsOpenLevelSelector}
            hasFx={hasFx}
            setLevelDifficulty={setLevelDifficulty}
          />
        )}

        <button
          onClick={() => {
            onButtonClick(hasFx);
            toggleMusic();
          }}
          onMouseEnter={() => {
            onButtonHover(hasFx);
            setHoverMusic(!hasMusic);
          }}
          onMouseLeave={() => setHoverMusic(hasMusic)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faMusic}
            color={hasMusic || hoverMusic ? iconActiveColor : iconColor}
          />
        </button>

        <button
          onClick={() => {
            onButtonClick(hasFx);
            toggleFx();
          }}
          onMouseEnter={() => {
            onButtonHover(hasFx);
            setHoverFx(!hasFx);
          }}
          onMouseLeave={() => setHoverFx(hasFx)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faVolumeOff}
            color={hasFx || hoverFx ? iconActiveColor : iconColor}
          />
        </button>
      </div>
      <div className={gameAreaStyles.logoContainer}>
        <Logo fill={iconColor} />
      </div>
      <div
        className={classnames(
          gameAreaStyles.toolbar,
          gameAreaStyles.toolbarRight
        )}
      >
        <button
          onClick={() => {
            onButtonClick(hasFx);
            if (typeof window !== "undefined") {
              window.localStorage.removeItem(`level-${levelId}`);
              window.location.reload();
            }
          }}
          onMouseEnter={() => onButtonHover(hasFx)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon icon={faRefresh} />
        </button>
        <button
          onMouseEnter={() => onButtonHover(hasFx)}
          onClick={() => {
            onButtonClick(hasFx);
            setIsOpenSolution(true);
          }}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
        <button
          onClick={() => {
            onButtonClick(hasFx);
            setIsOpenControls(!isOpenControls);
          }}
          onMouseEnter={() => {
            onButtonHover(hasFx);
            setHoverHelp(!isOpenControls);
          }}
          onMouseLeave={() => setHoverHelp(isOpenControls)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faCog}
            color={isOpenControls || hoverHelp ? iconActiveColor : iconColor}
          />
        </button>
        {isOpenControls && (
          <ControlsTooltip
            setIsOpenControls={setIsOpenControls}
            hasFx={hasFx}
          />
        )}
        {isOpenSolution && levelId && (
          <Animate
            play
            duration={0.5}
            start={{
              opacity: 0,
            }}
            end={{
              opacity: 1,
            }}
            easeType="ease-out"
          >
            <div
              className={gameAreaStyles.solutionWrapper}
              onClick={() => setIsOpenSolution(false)}
            >
              <div
                className={gameAreaStyles.solutionContainer}
                style={{
                  paddingTop,
                }}
              >
                <Solution level={levelId} />
              </div>
            </div>
          </Animate>
        )}
      </div>
    </div>
  );
};
