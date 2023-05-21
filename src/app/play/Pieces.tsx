"use client";
import { useDraggable } from "@dnd-kit/core";
import { useState, useCallback } from "react";
import { SpheresCrossUnitedSvg } from "./SpheresCrossUnitedSvg";

export type Rotation = 0 | 0.25 | 0.5 | 0.75;
export type Piece = {
  id: string | number;
  isOverBoard: boolean;
  position: { x: number; y: number };
  rotation: Rotation;
  shape: [number, number, number][];
  size: [number, number];
};

export type PiecesProps = { pieces: Piece[] };
export const Pieces = ({ pieces }: PiecesProps) => {
  // console.log("Pieces", pieces);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-items-center p-4 bg-gradient-to-b from-slate-300 to-slate-400">
      {pieces.map((piece) => (
        <Piece key={piece.id} {...piece} />
      ))}
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
}: Piece) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const draggingTransform = {
    x: (transform?.x ?? 0) + position.x,
    y: (transform?.y ?? 0) + position.y,
  };

  // console.log({ draggingTransform });

  const x = isDragging ? draggingTransform.x : position.x;
  const y = isDragging ? draggingTransform.y : position.y;

  const style = {
    transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn)`,
  };

  const onClickPath = useCallback(() => {
    // setRotation(rotation === 0.75 ? 0 : ((rotation + 0.25) as Rotation));
  }, []);

  const isPlaceable = isDragging && isOverBoard;

  return (
    <div
      className="piece"
      style={{
        width: "13rem",
        position: "relative",

        // transform: "translateX(2.25rem) translateY(-2.25rem) rotate(90deg)", // ratio of total spheres height / width + num connectors
        zIndex: 1,
        ...style,
      }}
      >
      <SpheresCrossUnitedSvg
        onClickPath={onClickPath}
        filter={"drop-shadow(3px 5px 2px rgb(1 1 1 / 0.4))"}
        setNodeRef={setNodeRef}
        listeners={listeners}
        attributes={attributes}
      />
      {/* {isPlaceable && (
        <SpheresCrossUnitedSvg onClickPath={onClickPath} isPlaceable />
      )} */}
    </div>
  );
};
