import { HTMLProps, MouseEventHandler, SVGProps } from "react";
import { Piece } from "./types";
import { CELL_SIZE, calcRadialGradient, calcShadow } from "./utils";

export const PieceDiv = ({
  onClick,
  isPlaceable,
  id,
  height,
  width,
  color,
  shape,
  opacity,
  hasBoxShadow: boxShadow,
  rotation,
  isFlippedX,
  isFlippedY,
}: Omit<HTMLProps<HTMLDivElement>, "shape"> & {
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
}) => (
  <div style={{ width, height }}>
    {shape.map((row, y) => {
      // Create a div or spacer for each cell in the piece
      return row.map((isFilledCell, x) =>
        isFilledCell
          ? [...Array(2)].map((_, i) => (
              /*  Create 2 pieces for each cell, one for the shadow and one for the piece
               *  This is to allow the shadow to be placed behind all the pieces */
              <div
                key={`${id}-${x}-${y}-${i}`}
                className={`piece-${id}`}
                style={{
                  position: "absolute",
                  left: `${x * CELL_SIZE}px`,
                  top: `${y * CELL_SIZE}px`,
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  background: i === 1 ? undefined : color,
                  backgroundImage:
                    i === 1
                      ? undefined
                      : `
                      radial-gradient(
                        circle at ${calcRadialGradient(
                          rotation,
                          isFlippedX,
                          isFlippedY
                        )}, 
                        rgba(255,255,255,0.4) 0%, 
                        rgba(255,255,255,0) 40%,
                        rgba(0,0,0,0) 40%,
                        rgba(0,0,0,0.4) 100%
                      )
                      `,
                  opacity,
                  zIndex: i === 1 ? 0 : 1,
                  pointerEvents: isPlaceable ? "none" : "auto",
                  borderRadius: "50%",
                  boxShadow:
                    i === 1 && boxShadow
                      ? `${calcShadow(
                          rotation,
                          isFlippedX,
                          isFlippedY
                        )} 15px 0px rgb(1 1 1 / 0.45)`
                      : undefined,
                }}
                onClick={onClick}
              />
            ))
          : null
      );
    })}
  </div>
);
