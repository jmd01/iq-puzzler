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
      <div className="p-4 rounded-3xl bg-gradient-to-b from-slate-500 to-slate-600">
        <div className="relative">
          {prePlacedPieces.map((piece) => 
            <Piece
              key={piece.id}
              piece={piece}
              setPieces={() => {}}
            />
          )}
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
                  className={`w-16 h-16 rounded-full transition-all bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] ${
                    isPreview
                      ? "from-slate-500 to-slate-200"
                      : "from-slate-800 to-slate-400"
                  }`}
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
