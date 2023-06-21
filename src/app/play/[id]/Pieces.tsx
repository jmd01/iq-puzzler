import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { GameAreaDragState } from "./GameArea";
import type { Piece as PieceType, Rotation } from "./types";
import {
  getDecimalPart,
  isActivePieceOverBoard,
  mergeRefs,
  updatePiecesWithFlippedPiece,
  updatePiecesWithRotatedPiece,
} from "./utils";
import { Animate } from "react-simple-animate";
import { PieceDiv } from "./PieceDiv";

export type PiecesProps = {
  pieces: PieceType[];
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
  activePieceId: PieceType["id"] | undefined;
  state: GameAreaDragState;
  boardBounds: DOMRect | undefined;
};
export const Pieces = forwardRef<HTMLDivElement, PiecesProps>(function Pieces(
  { pieces, setPieces, activePieceId, state, boardBounds },
  activePieceRef
) {
  return (
    <div className="flex items-center justify-center p-4 ">
      <div className="flex flex-wrap gap-4 justify-between max-w-4xl">
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
            />
          );
        })}
      </div>
    </div>
  );
});

export type PieceProps = {
  piece: PieceType;
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
  boardBounds?: DOMRect;
  index: number;
};

export const Piece = forwardRef<HTMLDivElement, PieceProps>(function Piece(
  { piece, setPieces, boardBounds, index },
  activePieceRef
) {
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
    d,
    color,
    height,
    width,
    shape,
  } = piece;
  const isDragging = isActivePiece && !!dragPosition;
  const isPlaced = !!placedInCells;

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;

  const rotationDecimal = getDecimalPart(rotation);
  const scaleX =
    (isFlippedX && (rotationDecimal === 25 || rotationDecimal === 75)) ||
    (isFlippedY && (rotationDecimal === 0 || rotationDecimal === 5))
      ? -1
      : 1;

  const scaleY =
    (isFlippedY && (rotationDecimal === 25 || rotationDecimal === 75)) ||
    (isFlippedX && (rotationDecimal === 0 || rotationDecimal === 5))
      ? -1
      : 1;

  const style = useMemo(
    () => ({
      transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn) scaleX(${scaleX}) scaleY(${scaleY})`,
      /**
       * Render unplaced pieces above board cells so they can be picked up again if they are dropped on the board but not placed
       * Render placed pieces below board cells as we listen for clicks on the board cells and determine active piece from the coords of the click
       */
      zIndex: isPlaced ? 0 : 20,
      transition: isDragging ? undefined : "transform 0.2s ease-out",
    }),
    [isDragging, isPlaced, rotation, scaleX, scaleY, x, y]
  );

  const ref = useRef<HTMLDivElement>(null);

  const onClickPath = useCallback(
    (event: MouseEvent) => {
      if (piece.isLocked) return;

      const pieceBounds = ref.current?.getBoundingClientRect();

      !isDragging &&
        pieceBounds &&
        boardBounds &&
        setPieces((pieces) =>
          event.ctrlKey || event.metaKey || event.shiftKey
            ? updatePiecesWithFlippedPiece(
                pieces,
                id,
                isActivePieceOverBoard(pieceBounds, boardBounds),
                event.ctrlKey || event.metaKey ? "x" : "y"
              )
            : updatePiecesWithRotatedPiece(
                pieces,
                id,
                isActivePieceOverBoard(pieceBounds, boardBounds)
              )
        );
    },
    [boardBounds, id, isDragging, piece.isLocked, setPieces]
  );

  useEffect(() => {
    const initialPosition = ref.current?.getBoundingClientRect();
    if (initialPosition) {
      setPieces((pieces) =>
        pieces.map((piece) =>
          piece.id === id
            ? {
                ...piece,
                initialPosition: { x: initialPosition.x, y: initialPosition.y },
              }
            : piece
        )
      );
    }
    // Only run on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mergeRefs([activePieceRef, ref])}
      style={{
        position: piece.isLocked ? "absolute" : "relative",
        ...style,
      }}
    >
      <Animate
        key={piece.id}
        play
        duration={0.3}
        delay={index * 0.05}
        start={{
          transform: "translateY(-20px)  scale(0)",
          opacity: 0.5,
        }}
        end={{
          transform: "translateX(0px) scale(1)",
          opacity: 1,
        }}
        easeType="ease-out"
        onComplete={() => {}}
      >
        <PieceDiv
          onClick={onClickPath}
          hasBoxShadow={!isPlaced}
          opacity={!isPlaced && !isDragging && piece.droppedOnBoard ? 0.8 : 1}
          id={id.toString()}
          color={color}
          width={width}
          height={height}
          shape={shape}
          rotation={rotation}
          isFlippedX={isFlippedX}
          isFlippedY={isFlippedY}
        />
      </Animate>
    </div>
  );
});
