import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { SpheresCrossUnitedSvg1 } from "./SpheresCrossUnitedSvg";
import { GameAreaDragState } from "./GameArea";
import type { Piece as PieceType, Rotation } from "./types";
import { mergeRefs, updatePiecesWithRotatedPiece } from "./utils";

export type PiecesProps = {
  pieces: PieceType[];
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
  activePieceId: PieceType["id"] | undefined;
  state: GameAreaDragState;
};
export const Pieces = forwardRef<HTMLDivElement, PiecesProps>(function Pieces(
  { pieces, setPieces, activePieceId, state },
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
          />
        );
      })}
    </div>
  );
});

export type PieceProps = {
  piece: PieceType;
  setPieces: Dispatch<SetStateAction<PieceType[]>>;
};

export const Piece = forwardRef<HTMLDivElement, PieceProps>(function Piece(
  { piece, setPieces },
  activePieceRef
) {
  const {
    id,
    position,
    rotation,
    shape,
    size,
    isActivePiece,
    onMouseDownPosition = { x: 0, y: 0 },
    dragPosition,
    placedInCells,
  } = piece;
  const isDragging = isActivePiece && !!dragPosition;
  const isPlaced = placedInCells;

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;
  const style = {
    transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn)`,
    /**
     * Render unplaced pieces above board cells so they can be picked up again if they are dropped on the board but not placed
     * Render placed pieces below board cells as we listen for clicks on the board cells and determine active piece from the coords of the click
     */
    zIndex: isPlaced ? 0 : 20,
  };

  const onClickPath = useCallback(() => {
    !isDragging &&
      setPieces((pieces) => updatePiecesWithRotatedPiece(pieces, id));
  }, [id, isDragging, setPieces]);

  const ref = useRef<HTMLDivElement>(null);
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
        width: "13rem",
        position: "relative",
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
});
