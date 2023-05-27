import { RefObject } from "react";
import { PreviewPiece } from "./types";

export const Board = ({
  boardRef,
  previewPiece,
}: {
  boardRef: RefObject<HTMLDivElement>;
  previewPiece: PreviewPiece | undefined;
}) => {
  return (
    <div className="grid grid-cols-1 items-center justify-items-center p-4">
      <div className="p-4 rounded-3xl bg-gradient-to-b from-slate-500 to-slate-600">
        <div className="relative">
          <div className="absolute w-full h-full">
            <div className="inline-grid grid-cols-12" ref={boardRef}>
              {[...Array(72)].map((_, i) => (
                <span
                  key={i}
                  className={`boardCell w-16 h-16 `}
                  data-board-cell={`${i % 12},${Math.floor(i / 12)}`}
                />
              ))}
            </div>
          </div>
          <div className="inline-grid grid-cols-12" ref={boardRef}>
            {[...Array(72)].map((_, i) => {
              const x = i % 12;
              const y = Math.floor(i / 12);
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
