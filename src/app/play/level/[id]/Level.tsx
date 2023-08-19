"use client";
import { GameArea } from "./GameArea";
import { Piece, PlacedPiece, levelSchema, piecesDataSchema } from "../types";
import { calcPlacedPosition, isRotatedSideways } from "../utils/utils";
import { getPlacedRotatedAndFlippedShape } from "../utils/sharedUtils";
import { useEffect, useState } from "react";

export default function Level({ level }: { level: number }) {
  const [levelData, setLevelData] = useState<{
    data:
      | {
          placedPieces: PlacedPiece[];
          unplacedPieces: Piece[];
        }
      | undefined;
    error: boolean;
    loading: boolean;
  }>({
    data: undefined,
    error: false,
    loading: true,
  });

  useEffect(() => {
    const getPieces = () => {
      fetch(`/play/level/${level}/api`)
        .then((res) => res.json())
        .then(({ allPieces, level }) => {
          console.log({ allPieces, level });

          // Ensure JSON.parsed() shape and placedInCells arrays are valid
          const allPiecesResult = piecesDataSchema.safeParse(allPieces);
          const levelResult = levelSchema.safeParse(level);

          console.log({ allPiecesResult, levelResult });

          if (allPiecesResult.success && levelResult.success) {
            // Extract the preplaced piece for this level from all solution pieces
            const placedPieces = allPiecesResult.data
              .filter((piece) =>
                levelResult.data?.solutionPieces?.find(
                  (solutionPiece) => solutionPiece.pieceId === piece.id
                )
              )
              .map(
                ({
                  id,
                  layer,
                  shape,
                  height,
                  width,
                  d,
                  color,
                  rotation,
                  isFlippedX,
                  isFlippedY,
                  placedInCells,
                }) => {
                  const previewPiece = placedInCells.reduce(
                    (acc, [cellX, cellY]) => {
                      return {
                        x: cellX < acc.x ? cellX : acc.x,
                        y: cellY < acc.y ? cellY : acc.y,
                      };
                    },
                    { x: 10, y: 5 }
                  );

                  const currentShape = getPlacedRotatedAndFlippedShape(
                    shape,
                    rotation,
                    isFlippedX,
                    isFlippedY
                  );

                  return {
                    id,
                    layer,
                    shape,
                    currentShape,
                    height,
                    width,
                    d,
                    color,
                    initialPosition: { x: 0, y: 0 },
                    position: calcPlacedPosition(
                      {
                        rotation: 0,
                        initialPosition: { x: 0, y: 0 },
                      },
                      isRotatedSideways(rotation)
                        ? { height, width }
                        : { width, height },
                      { top: 0, left: 0 },
                      previewPiece,
                      true
                    ),
                    isActivePiece: false,
                    droppedOnBoard: true,
                    isLocked: true,
                    rotation,
                    isFlippedX,
                    isFlippedY,
                    placedInCells,
                  };
                }
              );
            // Extract the game pieces for this levle and add the default values
            const unplacedPieces = allPiecesResult.data
              .filter(
                (piece) =>
                  !levelResult.data?.solutionPieces?.find(
                    (solutionPiece) => solutionPiece.pieceId === piece.id
                  )
              )
              .map(({ id, shape, height, width, d, color }) => ({
                id,
                layer: id,
                shape,
                currentShape: shape,
                height,
                width,
                d,
                color,
                initialPosition: { x: 0, y: 0 },
                position: { x: 0, y: 0 },
                isActivePiece: false,
                droppedOnBoard: false,
                isLocked: false,
                rotation: 0,
                isFlippedX: false,
                isFlippedY: false,
              }));

            console.log({ placedPieces, unplacedPieces });

            setLevelData({
              data: {
                placedPieces,
                unplacedPieces,
              },
              error: false,
              loading: false,
            });
          } else {
            console.log({ allPiecesResult, levelResult });
            setLevelData({
              data: undefined,
              error: true,
              loading: false,
            });
          }
        })
        .catch((e) => {
          console.log({ e });

          setLevelData({
            data: undefined,
            error: true,
            loading: false,
          });
        });
    };
    getPieces();
  }, [level]);

  if (levelData.data) {
    return (
      <GameArea
        placedPieces={levelData.data.placedPieces}
        unplacedPieces={levelData.data.unplacedPieces}
      />
    );
  } else {
    return <>Error</>;
  }
}
