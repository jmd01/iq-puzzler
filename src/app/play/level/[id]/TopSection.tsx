import { useState } from "react";
import Logo from "../components/Logo";
import gameAreaStyles from "../styles/gameArea.module.css";
import {
  faMusic,
  faQuestionCircle,
  faRefresh,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import Image from "next/image";

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
  const [isOpenHelp, setIsOpenHelp] = useState(false);
  const [hoverMusic, setHoverMusic] = useState(false);
  const [hoverFx, setHoverFx] = useState(false);
  const [hoverHelp, setHoverHelp] = useState(false);

  return (
    <div className={gameAreaStyles.topSection}>
      <div
        className={classnames(
          gameAreaStyles.toolbar,
          gameAreaStyles.toolbarLeft
        )}
      >
        <button
          onClick={() => toggleMusic()}
          onMouseEnter={() => setHoverMusic(!hasMusic)}
          onMouseLeave={() => setHoverMusic(hasMusic)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faMusic}
            color={hasMusic || hoverMusic ? iconActiveColor : iconColor}
          />
        </button>
        <button
          onClick={() => toggleFx()}
          onMouseEnter={() => setHoverFx(!hasFx)}
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
            const levelId = window.location.pathname.split("/").at(-1);
            window.localStorage.removeItem(`level-${levelId}`);
            window.location.reload();
          }}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon icon={faRefresh} />
        </button>
        <button
          onClick={() => setIsOpenHelp(!isOpenHelp)}
          onMouseEnter={() => setHoverHelp(!isOpenHelp)}
          onMouseLeave={() => setHoverHelp(isOpenHelp)}
          className={gameAreaStyles.toolbarButton}
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            color={isOpenHelp || hoverHelp ? iconActiveColor : iconColor}
          />
        </button>
        {isOpenHelp && (
          <div className={gameAreaStyles.helpTooltip}>
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
                Click to rotate
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
                Cmd + click to flip vertically
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
                Shift + click to flip horizontally
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
