"use client";
import { useCallback } from "react";
import { SpheresCrossUnitedSvg1 } from "./SpheresCrossUnitedSvg1";
import { GameAreaDragState } from "./GameArea";

export type Rotation = 0 | 0.25 | 0.5 | 0.75;
export type Piece = {
  id: string;
  isOverBoard: boolean;
  position: { x: number; y: number };
  rotation: Rotation;
  shape: [number, number, number][];
  size: [number, number];
  isActivePiece: boolean;
  onMouseDownPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
};

export type PiecesProps = {
  pieces: Piece[];
  activePieceId: Piece["id"] | undefined;
  state: GameAreaDragState;
};
export const Pieces = ({ pieces, activePieceId, state }: PiecesProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-items-center p-4 bg-gradient-to-b from-slate-300 to-slate-400">
      {pieces.map((piece) => {
        const isActivePiece = activePieceId === piece.id;

        return (
          <Piece
            key={piece.id}
            {...piece}
            isActivePiece={isActivePiece}
            onMouseDownPosition={
              isActivePiece ? state.onMouseDownPosition : undefined
            }
            dragPosition={isActivePiece ? state.dragPosition : undefined}
          />
        );
      })}
    </div>
  );
};

export const Piece = ({
  id,
  isOverBoard,
  position,
  rotation,
  shape,
  size,
  isActivePiece,
  onMouseDownPosition = { x: 0, y: 0 },
  dragPosition,
}: Piece) => {
  const isDragging = isActivePiece && !!dragPosition;

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;
  const style = {
    transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn)`,
  };

  const onClickPath = useCallback(() => {
    // setRotation(rotation === 0.75 ? 0 : ((rotation + 0.25) as Rotation));
  }, []);

  return (
    <div
      style={{
        width: "13rem",
        position: "relative",
        zIndex: 1,
        ...style,
      }}
    >
      <SpheresCrossUnitedSvg1
        onClickPath={onClickPath}
        filter={"drop-shadow(3px 5px 2px rgb(1 1 1 / 0.4))"}
        id={id}
      />
    </div>
  );
};
