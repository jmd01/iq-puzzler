import { Animate } from "react-simple-animate";
import * as twStyles from "../styles/styles";
import { sigmarOne } from "../../../fonts";
import classnames from "classnames";
import Image from "next/image";
import levelCompleteStyles from "../styles/levelComplete.module.css";
import {
  faHome,
  faRotate,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Confetti } from "./Confetti";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo } from "react";

export const LevelComplete = memo(function LevelComplete({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const params = useParams();

  return (
    <div
      style={{
        visibility: isVisible ? "visible" : "hidden",
        zIndex: isVisible ? "50" : "-1",
      }}
      className={twStyles.levelCompleteWrapper}
    >
      {isVisible && <Confetti />}
      <div className={twStyles.levelCompleteContainer}>
        <Animate
          play={isVisible}
          duration={0.4}
          start={{
            transform: "scale(1) translateY(30px)",
          }}
          end={{
            transform: "scale(1) translateY(0px)",
          }}
          easeType="ease-out"
        >
          <div
            className={classnames(
              twStyles.levelCompleteBadge,
              levelCompleteStyles.levelCompleteBadge
            )}
          >
            <div className={twStyles.levelCompleteStars}>
              <Animate
                play={isVisible}
                duration={0.4}
                start={{
                  transform: "scale(1) translateY(30px) rotate(-180deg)",
                }}
                end={{
                  transform: "scale(1) translateY(0px) rotate(0deg)",
                }}
                easeType="ease-out"
              >
                <Image src={"/star.svg"} width={80} height={77} alt="star" />
              </Animate>
              <span style={{ marginTop: -24 }}>
                <Animate
                  play={isVisible}
                  duration={0.5}
                  start={{
                    transform: "scale(1) translateY(30px) rotate(-180deg)",
                  }}
                  end={{
                    transform: "scale(1) translateY(0px) rotate(0deg)",
                  }}
                  easeType="ease-out"
                >
                  <Image src={"/star.svg"} width={100} height={96} alt="star" />
                </Animate>
              </span>
              <Animate
                play={isVisible}
                duration={0.4}
                start={{
                  transform: "scale(1) translateY(30px) rotate(-180deg)",
                }}
                end={{
                  transform: "scale(1) translateY(0px) rotate(0deg)",
                }}
                easeType="ease-out"
              >
                <Image src={"/star.svg"} width={80} height={77} alt="star" />
              </Animate>
            </div>
            <div
              className={classnames(
                sigmarOne.className,
                twStyles.levelCompleteText,
                levelCompleteStyles.levelCompleteText
              )}
            >
              LEVEL COMPLETE
            </div>
            <div
              className={classnames(
                levelCompleteStyles.levelCompleteStatsWrapper
              )}
            >
              <div
                className={classnames(
                  levelCompleteStyles.levelCompleteStatsKey
                )}
              >
                <div>MOVES:</div>
                <div>TIME:</div>
              </div>
              <div
                className={classnames(
                  levelCompleteStyles.levelCompleteStatsValue
                )}
              >
                <div>50</div>
                <div>4d 23h 15m 2s</div>
              </div>
            </div>
            <div
              style={{ transform: "translateY(40px)" }}
              className={twStyles.levelCompleteIcons}
            >
              <div
                style={{ background: "#d500ff" }}
                className={twStyles.levelCompleteIconWrapper}
              >
                <Link
                  href="/"
                  className={classnames(
                    twStyles.levelCompleteIcon,
                    levelCompleteStyles.levelCompleteIcon
                  )}
                >
                  <FontAwesomeIcon icon={faHome} />
                </Link>
              </div>
              <div
                style={{ background: "#00deff" }}
                className={twStyles.levelCompleteIconWrapper}
              >
                <button
                  onClick={() => window.location.reload()}
                  className={classnames(
                    twStyles.levelCompleteIcon,
                    levelCompleteStyles.levelCompleteIcon
                  )}
                >
                  <FontAwesomeIcon icon={faRotate} />
                </button>
              </div>
              <div
                style={{ background: "#fe0665" }}
                className={twStyles.levelCompleteIconWrapper}
              >
                <Link
                  href={`/play/level/${parseInt(params.id) + 1}`}
                  className={classnames(
                    twStyles.levelCompleteIcon,
                    levelCompleteStyles.levelCompleteIcon
                  )}
                >
                  <FontAwesomeIcon icon={faForwardStep} />
                </Link>
              </div>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  );
});
