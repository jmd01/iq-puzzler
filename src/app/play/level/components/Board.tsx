import { RefObject } from "react";
import { PlacedPiece, PreviewPiece } from "../types";
import { PreplacedPiece } from "./Pieces";
import { Animate } from "react-simple-animate";
import * as twStyles from "../styles/styles";
import boardStyles from "../styles/board.module.css";
import classnames from "classnames";
import { CELL_SIZE } from "../utils/utils";

export const Board = ({
  boardRef,
  previewPiece,
  prePlacedPieces,
}: {
  boardRef: RefObject<HTMLDivElement>;
  previewPiece: PreviewPiece | undefined;
  prePlacedPieces: PlacedPiece[];
}) => {
  return (
    <div className={twStyles.boardWrapper}>
      <Animate
        play
        duration={0.4}
        start={{
          opacity: 0.3,
          transform: "scale(1) translateY(30px)",
        }}
        end={{
          opacity: 1,
          transform: "scale(1) translateY(0px)",
        }}
        easeType="ease-out"
      >
        <div
          className={classnames(twStyles.boardContainer, boardStyles.boardBgrd)}
        >
          <div className="relative">
            {prePlacedPieces.map((piece, i) => (
              <PreplacedPiece
                key={piece.id}
                index={i}
                piece={{ ...piece, rotation: 0 }}
              />
            ))}
            <div className={twStyles.boardCellWrapper}>
              <div className={twStyles.boardCellContainer} ref={boardRef}>
                {[...Array(55)].map((_, i) => (
                  <span
                    key={i}
                    className={classnames("boardCell")}
                    data-board-cell={`${i % 11},${Math.floor(i / 11)}`}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className={twStyles.boardCellContainer} ref={boardRef}>
              {[...Array(55)].map((_, i) => {
                const x = i % 11;
                const y = Math.floor(i / 11);
                const isPreview = previewPiece?.cells?.some(
                  ([previewX, previewY]) => previewX === x && previewY === y
                );

                return (
                  <span
                    key={i}
                    className={classnames(
                      "rounded-full",
                      boardStyles.boardCell,
                      { [boardStyles.boardCellPreview]: isPreview }
                    )}
                    data-board-cell={`${x},${y}`}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Animate>
    </div>
  );
};
