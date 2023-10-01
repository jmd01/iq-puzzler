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
import Image from "next/image";
import { inter, sigmarOne } from "@/app/fonts";
import Solution from "../components/solution/Solution";
import { Animate } from "react-simple-animate";
import { isTouchDevice } from "../utils/utils";
import { onButtonClick, onButtonHover } from "./GameArea/hooks/useEventHandlers";

const iconColor = "#352d9d";
const iconActiveColor = "#4c44b4";

export const TopSection = ({
  hasMusic,
  toggleMusic,
  hasFx,
  toggleFx,
}: {
  hasMusic: boolean;
  toggleMusic: () => void;
  hasFx: boolean;
  toggleFx: () => void;
}) => {
  const [levelId, setLevelId] = useState<number>();
  const [isOpenControls, setIsOpenControls] = useState(levelId === 1);
  const [isOpenSolution, setIsOpenSolution] = useState(false);
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
  }, []);

  return (
    <div ref={ref} className={gameAreaStyles.topSection}>
      <div
        className={classnames(
          gameAreaStyles.toolbar,
          gameAreaStyles.toolbarLeft
        )}
      >
        <div
          className={classnames(
            gameAreaStyles.topSectionLevel,
            sigmarOne.className
          )}
        >
          L {levelId}
        </div>
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
            top={paddingTop}
            setIsOpenControls={setIsOpenControls}
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

const ControlsTooltip = ({
  top,
  setIsOpenControls,
}: {
  top: number;
  setIsOpenControls: (isOpen: boolean) => void;
}) => {
  return (
    <div
      className={gameAreaStyles.solutionWrapper}
      style={{ zIndex: 9999 }}
      onClick={() => setIsOpenControls(false)}
    >
      <div className={classnames(gameAreaStyles.helpTooltipWrapper)}>
        <Animate
          play
          duration={0.2}
          start={{
            transform: "translateY(20px)",
          }}
          end={{
            transform: "translateY(0px)",
          }}
          easeType="ease-out"
        >
          <div className={classnames(gameAreaStyles.helpTooltipContainer)}>
            <div
              className={classnames(
                gameAreaStyles.helpTooltip,
                inter.className
              )}
            >
              <h2 className={sigmarOne.className}>Game Controls</h2>
              <div className={gameAreaStyles.helpTooltipRow}>
                <div className={gameAreaStyles.helpTooltipImg}>
                  <Image
                    src={"/piece.svg"}
                    width={112}
                    height={64}
                    alt="Piece"
                    className={gameAreaStyles.tooltipPiece}
                  />
                  <Image
                    src={"/rotate.svg"}
                    width={50}
                    height={64}
                    alt="Rotate piece"
                    className={gameAreaStyles.tooltipArrowRotate}
                  />
                </div>
                <div className={gameAreaStyles.helpTooltipText}>
                  <h3>Rotate</h3>
                  {isTouchDevice() ? <pre>tap</pre> : <pre>click</pre>}
                </div>
              </div>
              <div className={gameAreaStyles.helpTooltipRow}>
                <div className={gameAreaStyles.helpTooltipImg}>
                  <Image
                    src={"/piece.svg"}
                    width={112}
                    height={64}
                    alt="Piece"
                    className={gameAreaStyles.tooltipPiece}
                  />

                  <Image
                    src={"/flip-v.svg"}
                    width={30}
                    height={64}
                    alt="Flip piece vertically"
                    className={gameAreaStyles.tooltipArrowFlipV}
                  />
                </div>
                <div className={gameAreaStyles.helpTooltipText}>
                  <h3>Flip vertically</h3>
                  {isTouchDevice() ? (
                    <pre>swipe vertically</pre>
                  ) : (
                    <>
                      <pre>cmd + click</pre>
                      <pre>ctrl + click</pre>
                    </>
                  )}
                </div>
              </div>
              <div className={gameAreaStyles.helpTooltipRow}>
                <div className={gameAreaStyles.helpTooltipImg}>
                  <Image
                    src={"/piece.svg"}
                    width={112}
                    height={64}
                    alt="Piece"
                  />

                  <Image
                    src={"/flip-h.svg"}
                    width={112}
                    height={64}
                    alt="Flip piece horizontally"
                    className={gameAreaStyles.tooltipArrowFlipH}
                  />
                </div>
                <div className={gameAreaStyles.helpTooltipText}>
                  <h3>Flip horizontally</h3>
                  {isTouchDevice() ? (
                    <pre>swipe horizontally</pre>
                  ) : (
                    <pre>shift + click</pre>
                  )}
                </div>
              </div>
              {isTouchDevice() ? (
                <div className={gameAreaStyles.helpTooltipRow}>
                  <div className={gameAreaStyles.helpTooltipText}>
                    <h3>TIPS</h3>
                    <p>
                      <b>Flip:</b> start your swipe outside the piece and swipe
                      all the way through it.
                    </p>
                    <p>
                      <b>Move:</b> make sure your start touch is on a piece,
                      then drag as normal.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Animate>
      </div>
    </div>
  );
};
