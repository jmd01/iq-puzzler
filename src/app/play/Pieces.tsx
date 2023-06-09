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
  isActivePieceOverBoard,
  mergeRefs,
  updatePiecesWithFlippedPiece,
  updatePiecesWithRotatedPiece,
} from "./utils";
import { PieceSvg } from "./PieceSvg";

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
    <div className="flex flex-wrap gap-4 items-center justify-items-center p-4 bg-gradient-to-b from-slate-300 to-slate-400">
      {pieces.map((piece) => {
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
            piece={pieceProps}
            setPieces={setPieces}
            ref={isActivePiece ? activePieceRef : undefined}
            boardBounds={boardBounds}
          />
        );
      })}
    </div>
  );
});

export type PieceProps = {
  piece: PieceType;
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
  boardBounds: DOMRect | undefined;
};

export const Piece = forwardRef<HTMLDivElement, PieceProps>(function Piece(
  { piece, setPieces, boardBounds },
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
  } = piece;
  const isDragging = isActivePiece && !!dragPosition;
  const isPlaced = placedInCells;

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;

  const style = useMemo(
    () => ({
      transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn) scaleX(${
        isFlippedX ? -1 : 1
      }) scaleY(${isFlippedY ? -1 : 1})`,
      /**
       * Render unplaced pieces above board cells so they can be picked up again if they are dropped on the board but not placed
       * Render placed pieces below board cells as we listen for clicks on the board cells and determine active piece from the coords of the click
       */
      zIndex: isPlaced ? 0 : 20,
    }),
    [isFlippedX, isFlippedY, isPlaced, rotation, x, y]
  );

  const ref = useRef<HTMLDivElement>(null);

  const onClickPath = useCallback(
    (event: MouseEvent) => {
      const pieceBounds = ref.current?.getBoundingClientRect();

      !isDragging &&
        pieceBounds &&
        boardBounds &&
        setPieces((pieces) =>
          (event.ctrlKey || event.metaKey)
            ? updatePiecesWithFlippedPiece(
                pieces,
                id,
                isActivePieceOverBoard(pieceBounds, boardBounds),
                "x" // TODO allow flipping on y axis
              )
            : updatePiecesWithRotatedPiece(
                pieces,
                id,
                isActivePieceOverBoard(pieceBounds, boardBounds)
              )
        );
    },
    [boardBounds, id, isDragging, setPieces]
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
        position: "relative",
        ...style,
      }}
    >
      <PieceSvg
        onClickPath={onClickPath}
        filter={
          isPlaced ? undefined : "drop-shadow(3px 5px 2px rgb(1 1 1 / 0.4))"
        }
        opacity={!isPlaced && !isDragging && piece.droppedOnBoard ? 0.8 : 1}
        id={id}
        d={d}
        color={color}
        width={width}
        height={height}
      />
    </div>
  );
});
