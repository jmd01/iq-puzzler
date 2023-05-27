import {
  Dispatch,
  RefObject,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { SpheresCrossUnitedSvg1 } from "./SpheresCrossUnitedSvg1";
import { GameAreaDragState } from "./GameArea";
import type { Piece as PieceType } from "./types";
import { type } from "os";
import { mergeRefs } from "./utils";

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
            // isActivePiece={isActivePiece}
            // onMouseDownPosition={
            //   isActivePiece ? state.onMouseDownPosition : undefined
            // }
            // dragPosition={isActivePiece ? state.dragPosition : undefined}
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
    isOverBoard,
    position,
    rotation,
    shape,
    size,
    isActivePiece,
    onMouseDownPosition = { x: 0, y: 0 },
    dragPosition,
  } = piece;
  const isDragging = isActivePiece && !!dragPosition;

  const draggingTransform = {
    x: (dragPosition?.x ?? 0) - onMouseDownPosition.x,
    y: (dragPosition?.y ?? 0) - onMouseDownPosition.y,
  };

  const x = isDragging ? draggingTransform.x + position.x : position.x;
  const y = isDragging ? draggingTransform.y + position.y : position.y;
  const style = {
    transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn)`,
  };

  const onClickPath = useCallback(() => {
    // setRotation(rotation === 0.75 ? 0 : ((rotation + 0.25) as Rotation));
  }, []);

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
  }, []);

  return (
    <div
      ref={mergeRefs([activePieceRef, ref])}
      style={{
        width: "13rem",
        position: "relative",
        zIndex: 1,
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
