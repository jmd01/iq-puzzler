"use client";
import { GameArea } from "./GameArea";
import { useEffect, useState } from "react";
import { useGameContext } from "../../../GameContext";
import { PlacedPiece, piecesDataSchema, levelSchema } from "../../types";
import { getPlacedRotatedAndFlippedShape } from "../../utils/sharedUtils";
import {
  calcPlacedPosition,
  getPlacedInCellsTopLeft,
  isRotatedSideways,
} from "../../utils/utils";

export default function Solution({ level }: { level: number }) {
  const [levelData, setLevelData] = useState<{
    data:
      | {
          placedPieces: PlacedPiece[];
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

  useEffect(() => {
    const getPieces = () => {
      fetch(`/play/level/${level}/api`)
        .then((res) => res.json())
        .then(({ allPieces, level }) => {
          // Ensure JSON.parsed() shape and placedInCells arrays are valid
          const allPiecesResult = piecesDataSchema.safeParse(allPieces);
          const levelResult = levelSchema.safeParse(level);

          if (allPiecesResult.success && levelResult.success) {
            const placedPieces = allPiecesResult.data.map(
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
            setLevelData({
              data: {
                placedPieces,
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
        .catch(() => {
          setLevelData({
            data: undefined,
            error: true,
            loading: false,
          });
        });
    };
    getPieces();
  }, [cellSize, level]);

  if (levelData.data) {
    return <GameArea placedPieces={levelData.data.placedPieces} />;
  }
  return <></>;
}
