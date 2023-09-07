"use client";
import { GameArea } from "./GameArea";
import { Piece, PlacedPiece, levelSchema, piecesDataSchema } from "../types";
import {
  calcPlacedPosition,
  getPlacedInCellsTopLeft,
  isRotatedSideways,
} from "../utils/utils";
import { getPlacedRotatedAndFlippedShape } from "../utils/sharedUtils";
import { useEffect, useState } from "react";
import { useGameContext } from "../../GameContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

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

  const { cellSize } = useGameContext();
  const localStorage = useLocalStorage(level);

  useEffect(() => {
    const getPieces = () => {
      fetch(`/play/level/${level}/api`)
        .then((res) => res.json())
        .then(({ allPieces, level }) => {
          // Ensure JSON.parsed() shape and placedInCells arrays are valid
          const allPiecesResult = piecesDataSchema.safeParse(allPieces);
          const levelResult = levelSchema.safeParse(level);

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
                  const previewPiece = getPlacedInCellsTopLeft(placedInCells);

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
                        id,
                        rotation: 0,
                        initialPosition: { x: 0, y: 0 },
                      },
                      isRotatedSideways(rotation)
                        ? { height, width }
                        : { width, height },
                      { top: 0, left: 0 },
                      previewPiece,
                      cellSize,
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
            // Extract the game pieces for this level and add the default values
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
              }))
              .map((piece) => {
                const localStoragePiece = localStorage
                  .getLocalStorage()
                  ?.placedPieces?.find((p) => p.id === piece.id);
                if (localStoragePiece) {
                  return {
                    ...piece,
                    ...localStoragePiece,
                  };
                }
                return piece;
              });

            setLevelData({
              data: {
                placedPieces,
                unplacedPieces,
              },
              error: false,
              loading: false,
            });
          } else {
            setLevelData({
              data: undefined,
              error: true,
              loading: false,
            });
          }
        })
        .catch((e) => {
          setLevelData({
            data: undefined,
            error: true,
            loading: false,
          });
        });
    };
    getPieces();
    // Don't run on localStorage change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellSize, level]);

  if (levelData.data) {
    return (
      <GameArea
        placedPieces={levelData.data.placedPieces}
        unplacedPieces={levelData.data.unplacedPieces}
        initialLocalStorageData={localStorage.getLocalStorage()}
        level={level}
      />
    );
  } else {
    return <>Error</>;
  }
}
