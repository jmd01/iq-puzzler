"use client";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  Modifier,
  DragStartEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Board } from "./Board";
import { Pieces, Piece } from "./Pieces";
import { useState } from "react";

export default function Page() {
  const [activePiece, setActivePiece] = useState<Piece["id"]>();
  const [pieces, setPieces] = useState(generatePieces());

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    console.log("handleDragStart", event);
    setActivePiece(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    console.log("handleDragEnd", event);

    // if (over?.id === "board") {
      console.log(pieces.find(({ id }) => id === active.id));

      const updatedPieces = pieces.map((piece) =>
        piece.id === active.id
          ? {
              ...piece,
              position: {
                x: piece.position.x + delta.x,
                y: piece.position.y + delta.y,
              },
            }
          : piece
      );

      console.log(updatedPieces.find(({ id }) => id === active.id));

      setPieces(updatedPieces);
    // }
  };

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("handleDragOver", event);

    if (over?.id === "board") {
      console.log("do dragover stuff");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      // modifiers={[restrictToWindowEdges]}
    >
      <GameArea pieces={pieces} setPieces={setPieces} />
    </DndContext>
  );
}

const GameArea = ({
  pieces,
  setPieces,
}: {
  pieces: Piece[];
  setPieces: (pieces: Piece[]) => void;
}) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: "gameArea",
  });
  const { isOver: isOverBoard, setNodeRef: setBoardRef } = useDroppable({
    id: "board",
  });

  return (
    <div ref={setNodeRef}>
      <Board setBoardRef={setBoardRef} />
      <Pieces pieces={pieces} />
    </div>
  );
};

const gridSize = 20;

const snapToGridModifier: Modifier = (args) => {
  const { transform } = args;

  return {
    ...transform,
    x: Math.ceil(transform.x / gridSize) * gridSize,
    y: Math.ceil(transform.y / gridSize) * gridSize,
  };
};

const generatePieces = (): Piece[] =>
  [...Array(10)].map((_, i) => ({
    id: i.toString(),
    isOverBoard: false,
    position: { x: 0, y: 0 },
    rotation: 0,
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    size: [3, 4],
  }));
