import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameAreaDragState } from "../types";
import type { Piece as PieceType } from "../types";
import {
  calcPlacedPosition,
  isActivePieceOverBoard,
  mergeRefs,
  updatePiecesWithFlippedPiece,
  updatePiecesWithRotatedPiece,
  getPlacedInCellsTopLeft,
  calcRotatedInitialPiecePosition,
} from "../utils/utils";
import { Animate } from "react-simple-animate";
import { PieceDiv } from "./PieceDiv";
import * as twStyles from "../styles/styles";
import { useGameContext } from "../../GameContext";
import classnames from "classnames";
import piecesStyles from "../styles/gameArea.module.css";
import { LevelLocalStorage } from "../[id]/hooks/useLocalStorage";

export type PiecesProps = {
  pieces: PieceType[];
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
  activePieceId: PieceType["id"] | undefined;
  state: GameAreaDragState;
  boardBounds: DOMRect | undefined;
  boardAnimationComplete: boolean;
  initialLocalStorageData?: LevelLocalStorage;
};
export const Pieces = forwardRef<HTMLDivElement, PiecesProps>(function Pieces(
  {
    pieces,
    setPieces,
    activePieceId,
    state,
    boardBounds,
    boardAnimationComplete,
    initialLocalStorageData,
  },
  activePieceRef
) {

  return (
    <div
      className={classnames(
        twStyles.piecesContainer,
        piecesStyles.piecesContainer
      )}
    >
      {pieces.map((piece, i) => {
        const isActivePiece = activePieceId === piece.id;
        const pieceProps: PieceType = {
          ...piece,
          isActivePiece,
          onMouseDownPosition: isActivePiece
            ? state.onMouseDownPosition
            : undefined,
          dragPosition: isActivePiece ? state.dragPosition : undefined,
        };

        return (
          <Piece
            key={piece.id}
            index={i}
            piece={pieceProps}
            setPieces={setPieces}
            ref={isActivePiece ? activePieceRef : undefined}
            boardBounds={boardBounds}
            boardAnimationComplete={boardAnimationComplete}
            initialLocalStorageData={initialLocalStorageData}
          />
        );
      })}
    </div>
  );
});

export type PieceProps = {
  piece: PieceType;
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
  boardBounds?: DOMRect;
  boardAnimationComplete: boolean;
  index: number;
  initialLocalStorageData?: LevelLocalStorage;
};

export const Piece = forwardRef<HTMLDivElement, PieceProps>(function Piece(
  {
    piece,
    setPieces,
    boardBounds,
    boardAnimationComplete,
    index,
    initialLocalStorageData,
  },
  activePieceRef
) {
  const { cellSize, width, height } = useGameContext();
  const {
    id,
    position,
    rotation,
    isFlippedX,
    isFlippedY,
    isActivePiece,
    onMouseDownPosition = { x: 0, y: 0 },
    dragPosition,
    placedInCells,
    color,
    shape,
  } = piece;
  const isDragging = isActivePiece && !!dragPosition;
  const isPlaced = !!placedInCells;
  const [isHovered, setIsHovered] = useState(false);

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;

  const rotateX = isFlippedX ? 180 : 0;
  const rotateY = isFlippedY ? 180 : 0;

  const style = useMemo(
    () => ({
      transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      /**
       * Render unplaced pieces above board cells so they can be picked up again if they are dropped on the board but not placed
       * Render placed pieces below board cells as we listen for clicks on the board cells and determine active piece from the coords of the click
       */
      zIndex: isPlaced ? 0 : 20 + piece.layer,
      transition: isDragging ? undefined : "transform 0.2s ease-out",
    }),
    [isDragging, isPlaced, piece.layer, rotateX, rotateY, rotation, x, y]
  );

  const ref = useRef<HTMLDivElement>(null);

  const onClickPath = useCallback(
    (event: MouseEvent) => {
      if (piece.isLocked) return;

      const pieceBounds = ref.current?.getBoundingClientRect();

      if (!isDragging && pieceBounds && boardBounds) {
        setPieces((pieces) =>
          event.ctrlKey || event.metaKey || event.shiftKey
            ? updatePiecesWithFlippedPiece(
                pieces,
                id,
                isActivePieceOverBoard(pieceBounds, boardBounds, cellSize),
                event.ctrlKey || event.metaKey ? "x" : "y"
              )
            : updatePiecesWithRotatedPiece(
                pieces,
                id,
                isActivePieceOverBoard(pieceBounds, boardBounds, cellSize)
              )
        );
      }
    },
    [boardBounds, cellSize, id, isDragging, piece.isLocked, setPieces]
  );

  useEffect(() => {
    const pieceBounds = ref.current?.getBoundingClientRect();

    if (pieceBounds && boardAnimationComplete) {
      setPieces((pieces) =>
        pieces
          .map((piece) => {
            return piece.id === id
              ? {
                  ...piece,
                  // If piece was preplaced from local storage and was rotated, adjust the initial position, otherwise just use initial position
                  initialPosition: calcRotatedInitialPiecePosition(
                    pieceBounds,
                    piece.rotation,
                    pieceBounds,
                    true
                  ),
                }
              : piece;
          })
          .map((piece) => {
            // Restore placed pieces from local storage to their correct position
            if (piece.placedInCells && boardBounds && piece.id === id) {
              return {
                ...piece,
                position: calcPlacedPosition(
                  piece,
                  pieceBounds,
                  boardBounds,
                  getPlacedInCellsTopLeft(piece.placedInCells),
                  cellSize
                ),
              };
            }
            return piece;
          })
      );
    }
    // Only run on first render or when window is resized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellSize, width, height, boardAnimationComplete]);

  const timeoutRef = useRef<number | undefined>(undefined);

  return (
    <div
      id={`piece-${id}`}
      ref={mergeRefs([activePieceRef, ref])}
      style={{
        position: piece.isLocked ? "absolute" : "relative",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Animate
        key={piece.id}
        play
        duration={0.25}
        delay={index * 0.03}
        start={{
          transform: "translateY(-20px)  scale(0)",
          opacity: 0.5,
        }}
        end={{
          transform: "translateX(0px) scale(1)",
          opacity: 1,
        }}
        easeType="ease-out"
      >
        <PieceDiv
          onClick={onClickPath}
          hasBoxShadow={!isPlaced}
          hasOutline={!isPlaced && isHovered}
          opacity={!isPlaced && !isDragging && piece.droppedOnBoard ? 0.8 : 1}
          id={id.toString()}
          color={color}
          shape={shape}
          rotation={rotation}
          isFlippedX={isFlippedX}
          isFlippedY={isFlippedY}
          onMouseEnter={() => {
            clearTimeout(timeoutRef.current);
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            if (!isPlaced) {
              timeoutRef.current = window.setTimeout(
                () => setIsHovered(false),
                100
              );
            }
          }}
        />
      </Animate>
    </div>
  );
});

export type PreplacedPieceProps = {
  piece: PieceType;
  index: number;
};

export const PreplacedPiece = forwardRef<HTMLDivElement, PreplacedPieceProps>(
  function Piece({ piece, index }, activePieceRef) {
    const {
      id,
      position,
      color,
      height,
      width,
      currentShape,
      rotation = 0,
    } = piece;

    const x = position.x;
    const y = position.y;

    const style = useMemo(
      () => ({
        // transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn)`,
        /**
         * Render unplaced pieces above board cells so they can be picked up again if they are dropped on the board but not placed
         * Render placed pieces below board cells as we listen for clicks on the board cells and determine active piece from the coords of the click
         */
        zIndex: 0,
        transition: "transform 0.2s ease-out",
      }),
      [rotation, x, y]
    );

    const ref = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={mergeRefs([activePieceRef, ref])}
        style={{
          position: "absolute",
          ...style,
        }}
      >
        <Animate
          key={piece.id}
          play
          duration={0.25}
          delay={index * 0.03}
          start={{
            transform: "translateY(-20px)  scale(0)",
            opacity: 0.5,
          }}
          end={{
            transform: "translateX(0px) scale(1)",
            opacity: 1,
          }}
          easeType="ease-out"
        >
          <PieceDiv
            hasBoxShadow={false}
            hasOutline={false}
            opacity={1}
            id={id.toString()}
            color={color}
            width={width}
            height={height}
            shape={currentShape}
            rotation={rotation}
            isFlippedX={false}
            isFlippedY={false}
          />
        </Animate>
      </div>
    );
  }
);