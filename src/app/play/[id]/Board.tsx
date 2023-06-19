import { RefObject } from "react";
import { PlacedPiece, PreviewPiece } from "./types";
import { Piece } from "./Pieces";

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
    <div className="grid grid-cols-1 items-center justify-items-center p-4">
      <div
        className="p-4 rounded-3xl"
        style={{
          // backgroundImage: `linear-gradient(45deg, #222830, #222a37)`,
          backgroundImage: `linear-gradient(135deg, #173e71, #10386d)`,
        }}
      >
        <div className="relative">
          {prePlacedPieces.map((piece) => (
            <Piece key={piece.id} piece={piece} setPieces={() => {}} />
          ))}
          <div className="absolute w-full h-full z-10">
            <div className="inline-grid grid-cols-11" ref={boardRef}>
              {[...Array(55)].map((_, i) => (
                <span
                  key={i}
                  className={`boardCell w-16 h-16 `}
                  data-board-cell={`${i % 11},${Math.floor(i / 11)}`}
                />
              ))}
            </div>
          </div>
          <div className="inline-grid grid-cols-11" ref={boardRef}>
            {[...Array(55)].map((_, i) => {
              const x = i % 11;
              const y = Math.floor(i / 11);
              const isPreview = previewPiece?.cells?.some(
                ([previewX, previewY]) => previewX === x && previewY === y
              );

              return (
                <span
                  key={i}
                  className={`w-16 h-16 rounded-full
                  `}
                  style={{
                    backgroundImage: `radial-gradient(
                      circle at 20% 20%, 
                      rgba(1,1,1,0.5) 2%, 
                      rgba(1,1,1,0.2) 40%, 
                      rgba(255,255,255,0.2) 79%,
                      rgba(255,255,255,0.4) 80%,
                      rgba(255,255,255,0.4) 100%
                      )`,
                    boxShadow: `
                      rgb(255, 255, 255, 0.25) 0.5px 0.5px 0.3px 0.3px inset
                      `,
                  }}
                  data-board-cell={`${x},${y}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
