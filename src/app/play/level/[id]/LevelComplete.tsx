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
import { memo, useEffect, useState } from "react";
import {
  addYears,
  addMonths,
  addDays,
  addHours,
  addMinutes,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  onButtonClick,
  onButtonHover,
} from "./GameArea/hooks/useEventHandlers";
import { useGameContext } from "../../GameContext";
import { getLevelDifficulty, playFx } from "../utils/utils";
import { LevelSelectorTooltip } from "./LevelSelectorTooltip";

export const LevelComplete = memo(function LevelComplete({
  isVisible,
  moves,
  startDate,
}: {
  isVisible: boolean;
  moves: number;
  startDate: Date;
}) {
  const params = useParams<{ id: string }>();
  const nextLevelId = parseInt(params.id) + 1;
  const { clearLocalStorage } = useLocalStorage(parseInt(params.id));
  const { hasFx, setLevelId } = useGameContext();
  const [isOpenLevelSelector, setIsOpenLevelSelector] = useState(false);

  useEffect(() => {
    if (isVisible && hasFx) {
      playFx("/audio/level-complete-group.mp3", hasFx, 0.3);
    }
  }, [hasFx, isVisible]);

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
              LEVEL {params.id} COMPLETE
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
                <div>DIFFICULTY:</div>
              </div>
              <div
                className={classnames(
                  levelCompleteStyles.levelCompleteStatsValue
                )}
              >
                <div>{moves}</div>
                <div>{completionTime(startDate)}</div>
                <div>{getLevelDifficulty(parseInt(params.id))} </div>
              </div>
            </div>
            <button
              className={classnames(
                sigmarOne.className,
                levelCompleteStyles.levelCompleteChangeButton
              )}
              onClick={() => setIsOpenLevelSelector(true)}
            >
              Change Difficulty
            </button>
            {isOpenLevelSelector && (
              <LevelSelectorTooltip
                setIsOpenLevelSelector={setIsOpenLevelSelector}
                hasFx={hasFx}
              />
            )}

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
                  onMouseEnter={() => onButtonHover(hasFx)}
                  onClick={() => onButtonClick(hasFx)}
                >
                  <FontAwesomeIcon icon={faHome} />
                </Link>
              </div>
              <div
                style={{ background: "#00deff" }}
                className={twStyles.levelCompleteIconWrapper}
              >
                <button
                  onClick={() => {
                    onButtonClick(hasFx);
                    clearLocalStorage();
                    window.location.reload();
                  }}
                  onMouseEnter={() => onButtonHover(hasFx)}
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
                  href={`/play/level/${nextLevelId}`}
                  className={classnames(
                    twStyles.levelCompleteIcon,
                    levelCompleteStyles.levelCompleteIcon
                  )}
                  onMouseEnter={() => onButtonHover(hasFx)}
                  onClick={() => {
                    onButtonClick(hasFx);
                    setLevelId(nextLevelId);
                  }}
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

const completionTime = (startDate: Date) => {
  const y = new Date();
  let x = startDate;

  let temp;
  temp = differenceInYears(y, x);
  let result = temp ? temp + "y " : "";
  x = addYears(x, temp);
  temp = differenceInMonths(y, x);
  result = temp ? result + temp + "m " : result;
  x = addMonths(x, temp);
  temp = differenceInDays(y, x);
  result = temp ? result + temp + "d " : result;
  x = addDays(x, temp);
  temp = differenceInHours(y, x);
  result = temp ? result + temp + "h " : result;
  x = addHours(x, temp);
  temp = differenceInMinutes(y, x);
  result = temp ? result + temp + "m " : result;
  x = addMinutes(x, temp);
  temp = differenceInSeconds(y, x);
  return result + temp + "s";
};
