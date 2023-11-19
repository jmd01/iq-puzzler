import gameAreaStyles from "../styles/gameArea.module.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import Image from "next/image";
import { inter, sigmarOne } from "@/app/fonts";
import { Animate } from "react-simple-animate";
import { isTouchDevice } from "../utils/utils";
import {
  onButtonClick,
  onButtonHover
} from "./GameArea/hooks/useEventHandlers";

export const ControlsTooltip = ({
  setIsOpenControls, hasFx,
}: {
  setIsOpenControls: (isOpen: boolean) => void;
  hasFx: boolean;
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
              <button
                onClick={() => {
                  onButtonClick(hasFx);
                  setIsOpenControls(false);
                }}
                onMouseEnter={() => {
                  onButtonHover(hasFx);
                }}
                className={gameAreaStyles.toolbarButton}
                style={{ position: "absolute", top: -6, right: 0 }}
              >
                <FontAwesomeIcon icon={faClose} color={"white"} />
              </button>

              <div className={gameAreaStyles.helpTooltipRow}>
                <div className={gameAreaStyles.helpTooltipImg}>
                  <Image
                    src={"/piece.svg"}
                    width={112}
                    height={64}
                    alt="Piece"
                    className={gameAreaStyles.tooltipPiece} />
                  <Image
                    src={"/rotate.svg"}
                    width={50}
                    height={64}
                    alt="Rotate piece"
                    className={gameAreaStyles.tooltipArrowRotate} />
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
                    className={gameAreaStyles.tooltipPiece} />

                  <Image
                    src={"/flip-v.svg"}
                    width={30}
                    height={64}
                    alt="Flip piece vertically"
                    className={gameAreaStyles.tooltipArrowFlipV} />
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
                    alt="Piece" />

                  <Image
                    src={"/flip-h.svg"}
                    width={112}
                    height={64}
                    alt="Flip piece horizontally"
                    className={gameAreaStyles.tooltipArrowFlipH} />
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
                      <b>Flip:</b> start your swipe <b>OUTSIDE</b> the piece and swipe
                      all the way through it.
                    </p>
                    <p>
                      <b>Move:</b> make sure your start touch is <b>ON</b> a piece,
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
