import gameAreaStyles from "../styles/gameArea.module.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import { inter, sigmarOne } from "@/app/fonts";
import { Animate } from "react-simple-animate";
import {
  onButtonClick,
  onButtonHover,
} from "./GameArea/hooks/useEventHandlers";
import { useGameContext } from "../../GameContext";
import Link from "next/link";
import { Difficulty } from "../types";
import { mapDifficultyToLevelId } from "../utils/utils";
import * as twStyles from "../styles/styles";
import levelCompleteStyles from "../styles/levelComplete.module.css";

export const LevelSelectorTooltip = ({
  setIsOpenLevelSelector,
  setLevelDifficulty,
  hasFx,
}: {
  setIsOpenLevelSelector: (isOpen: boolean) => void;
  setLevelDifficulty: (difficulty: Difficulty) => void;
  hasFx: boolean;
}) => {
  const { setLevelId } = useGameContext();

  return (
    <div
      className={gameAreaStyles.solutionWrapper}
      style={{ zIndex: 9999 }}
      onClick={() => setIsOpenLevelSelector(false)}
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
              <h2 className={sigmarOne.className}>Level Difficulty</h2>
              <button
                onClick={() => {
                  onButtonClick(hasFx);
                  setIsOpenLevelSelector(false);
                }}
                onMouseEnter={() => {
                  onButtonHover(hasFx);
                }}
                className={gameAreaStyles.toolbarButton}
                style={{ position: "absolute", top: -6, right: 0 }}
              >
                <FontAwesomeIcon icon={faClose} color={"white"} />
              </button>

              <div
                className={classnames(
                  gameAreaStyles.levelSelectRow,
                  "flex-col items-center"
                )}
              >
                <LevelSelectorButton
                  hasFx={hasFx}
                  difficulty="EASY"
                  setLevelId={setLevelId}
                  color="#fe0665"
                  setLevelDifficulty={setLevelDifficulty}
                />
                <LevelSelectorButton
                  hasFx={hasFx}
                  difficulty="MEDIUM"
                  setLevelId={setLevelId}
                  color="#8100ff"
                  setLevelDifficulty={setLevelDifficulty}
                />
                <LevelSelectorButton
                  hasFx={hasFx}
                  difficulty="EXPERT"
                  setLevelId={setLevelId}
                  color="#00c04b"
                  setLevelDifficulty={setLevelDifficulty}
                />
                <LevelSelectorButton
                  hasFx={hasFx}
                  difficulty="WIZARD"
                  setLevelId={setLevelId}
                  color="#0011ff"
                  setLevelDifficulty={setLevelDifficulty}
                />
              </div>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  );
};

export const LevelSelectorButton = ({
  hasFx,
  difficulty,
  setLevelId,
  setLevelDifficulty,
  color,
}: {
  hasFx: boolean;
  difficulty: Difficulty;
  setLevelId: (level: number) => void;
  setLevelDifficulty: (difficulty: Difficulty) => void;
  color: string;
}) => {
  return (
    <div
      style={{ background: color }}
      className={twStyles.levelCompleteIconWrapper}
    >
      <Link
        href={`/play/level/${mapDifficultyToLevelId[difficulty]}`}
        className={classnames(
          twStyles.levelCompleteIcon,
          levelCompleteStyles.levelCompleteIcon,
          sigmarOne.className,
          "w-auto h-12 px-4 py-1 text-white"
        )}
        onMouseEnter={() => onButtonHover(hasFx)}
        onClick={() => {
          onButtonClick(hasFx);
          setLevelId(mapDifficultyToLevelId[difficulty]);
          setLevelDifficulty(difficulty);
        }}
      >
        {difficulty}
      </Link>
    </div>
  );
};
