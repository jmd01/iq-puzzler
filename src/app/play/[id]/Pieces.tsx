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
  boardBounds?: DOMRect;
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
    shape,
  } = piece;
  const isDragging = isActivePiece && !!dragPosition;
  const isPlaced = placedInCells;

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;

  const scaleX =
    (isFlippedX && (rotation === 0.25 || rotation === 0.75)) ||
    (isFlippedY && (rotation === 0 || rotation === 0.5))
      ? -1
      : 1;

  const scaleY =
    (isFlippedY && (rotation === 0.25 || rotation === 0.75)) ||
    (isFlippedX && (rotation === 0 || rotation === 0.5))
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
      transition: "transform 0.2s ease-out",
    }),
    [isPlaced, rotation, scaleX, scaleY, x, y]
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
      {/* {`piece-${id}`} */}
      {/* <PieceSvg
        onClickPath={onClickPath}
        filter={
          isPlaced ? undefined : "drop-shadow(3px 5px 2px rgb(1 1 1 / 0.4))"
        }
        opacity={!isPlaced && !isDragging && piece.droppedOnBoard ? 0.8 : 1}
        id={id.toString()}
        d={d}
        color={color}
        width={width}
        height={height}
      /> */}
      <PieceDiv
        onClick={onClickPath}
        filter={
          isPlaced
            ? undefined
            : `drop-shadow(${calcShadow(rotation)} 7px rgb(1 1 1 / 0.8))`
        }
        boxShadow={`${calcShadow(rotation)} 7px rgb(1 1 1 / 0.8)`}
        opacity={!isPlaced && !isDragging && piece.droppedOnBoard ? 0.8 : 1}
        id={id.toString()}
        color={color}
        width={width}
        height={height}
        shape={shape}
      />
    </div>
  );
});

const calcShadow = (rotation: number): string => {
  console.log(getDecimalPart(rotation), rotation);

  switch (getDecimalPart(rotation)) {
    case 25:
      return "5px -5px";
    case 5:
      return "-5px -5px";
    case 75:
      return "-5px 5px";
    default:
      return "5px 5px";
  }
};

function getDecimalPart(num: number) {
  if (Number.isInteger(num)) {
    return 0;
  }

  const decimalStr = num.toString().split(".")[1];
  return Number(decimalStr);
}
