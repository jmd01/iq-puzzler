import { HTMLProps, MouseEventHandler, SVGProps } from "react";
import { Piece } from "./types";
import { CELL_SIZE } from "./utils";

export const PieceDiv = ({
  onClick,
  isPlaceable,
  id,
  height,
  width,
  color,
  shape,
  opacity,
  filter,
  boxShadow,
}: Omit<HTMLProps<HTMLDivElement>, "shape"> & {
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  isPlaceable?: boolean;
  id: string;
  color: string;
  shape: Piece["shape"];
  opacity: number;
  filter?: string;
  boxShadow?: string;
}) => (
  <div style={{ width, height }}>
    {shape.map((row, y) => {
      // Create a div or spacer for each cell in the piece
      return row.map((isFilledCell, x) =>
        isFilledCell
          ? [...Array(2)].map((_, i) => (
              <div
                key={`${id}-${x}-${y}`}
                id={`piece-${id}`}
                style={{
                  position: "absolute",
                  left: `${x * CELL_SIZE}px`,
                  top: `${y * CELL_SIZE}px`,
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  backgroundColor: i === 1 ? "none" : color,
                  opacity,
                  zIndex: i === 1 ? 0 : 1,
                  pointerEvents: isPlaceable ? "none" : "auto",
                  borderRadius: "50%",
                  // filter,
                  boxShadow: i === 1 ? boxShadow : undefined,
                }}
                onClick={onClick}
              />
            ))
          : null
      );
    })}
  </div>
);
