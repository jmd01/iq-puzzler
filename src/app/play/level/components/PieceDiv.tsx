import { HTMLProps, MouseEventHandler, useState } from "react";
import { Piece } from "../types";
import { calcRadialGradient, calcShadow } from "../utils/utils";
import { useGameContext } from "../../GameContext";

export const PieceDiv = ({
  onClick,
  isPlaceable,
  id,
  color,
  shape,
  opacity,
  hasBoxShadow: boxShadow,
  rotation,
  isFlippedX,
  isFlippedY,
  hasOutline,
  onMouseEnter,
  onMouseLeave,
}: Omit<HTMLProps<HTMLDivElement>, "shape" | "currentShape"> & {
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  isPlaceable?: boolean;
  id: string;
  color: string;
  shape: Piece["shape"];
  opacity: number;
  hasBoxShadow: boolean;
  rotation: number;
  isFlippedX: boolean;
  isFlippedY: boolean;
  hasOutline: boolean;
}) => {
  const cellSize = useGameContext().cellSize || 64;
  return (
    <div
      style={{
        width: cellSize * shape[0].length,
        height: cellSize * shape.length,
      }}
    >
      {shape.map((row, y) => {
        // Create a div or spacer for each cell in the piece
        return row.map((isFilledCell, x) =>
          isFilledCell
            ? [...Array(3)].map((_, i) => (
                /*  Create 3 pieces for each cell, one for the shadow, one for the piece and one for a transparent square target area
                 *  This is to allow the shadow to be placed behind all the pieces and the square target
                 * is a bit more forgiving for touch devices. E.g it prevents annoying clicks in the gaps between the rounded pieces which could trigger a swipe instead of a drag
                 */
                <div
                  key={`${id}-${x}-${y}-${i}`}
                  className={`piece-${id}`}
                  style={{
                    position: "absolute",
                    left: `${x * cellSize}px`,
                    top: `${y * cellSize}px`,
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    background: i === 0 ? color : undefined,
                    backgroundImage:
                      i === 0
                        ? `
                      radial-gradient(
                        circle at ${calcRadialGradient(
                          rotation,
                          isFlippedX,
                          isFlippedY
                        )}, 
                        rgba(255,255,255,0.6) 0%, 
                        rgba(255,255,255,0) 40%,
                        rgba(0,0,0,0) 40%,
                        rgba(0,0,0,0.4) 100%
                      )
                      `
                        : undefined,
                    opacity,
                    zIndex: i - 1,
                    pointerEvents: isPlaceable ? "none" : "auto",
                    borderRadius: i === 2 ? undefined : "50%",
                    boxShadow:
                      i === 1 && boxShadow
                        ? `${calcShadow(
                            rotation,
                            isFlippedX,
                            isFlippedY
                          )} 15px 0px rgb(1 1 1 / 0.45)`
                        : undefined,
                    outline:
                      i === 1 && hasOutline
                        ? "2px solid rgba(255, 255, 255, 0.8)"
                        : undefined,
                  }}
                  onClick={onClick}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              ))
            : null
        );
      })}
    </div>
  );
};
