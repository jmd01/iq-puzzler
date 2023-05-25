"use client";
import { Board } from "./Board";
import { Pieces, Piece } from "./Pieces";
import { useRef, useState, MouseEvent, useCallback, useReducer } from "react";
import type { Reducer } from "react";

export type GameAreaDragState = {
  isMouseDown: boolean;
  isDragging: boolean;
  activePieceId?: Piece["id"];
  onMouseDownPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
};

const initialState: GameAreaDragState = {
  isMouseDown: false,
  isDragging: false,
  activePieceId: undefined,
  onMouseDownPosition: undefined,
  dragPosition: undefined,
};

type GameAreaAction =
  | {
      type: "MOUSE_DOWN";
      position: { x: number; y: number };
      activePieceId: Piece["id"];
    }
  | { type: "MOUSE_UP" }
  | { type: "DRAG_MOVE"; position: { x: number; y: number } };

const reducer = (state: GameAreaDragState, action: GameAreaAction) => {
  switch (action.type) {
    case "MOUSE_DOWN":
      return {
        ...state,
        isMouseDown: true,
        onMouseDownPosition: action.position,
        activePieceId: action.activePieceId,
      };
    case "MOUSE_UP":
      return {
        ...state,
        isMouseDown: false,
        activePiece: undefined,
        isDragging: false,
        onMouseDownPosition: undefined,
        dragPosition: undefined,
      };
    case "DRAG_MOVE":
      return {
        ...state,
        isDragging: true,
        dragPosition: action.position,
      };
    default:
      throw new Error();
  }
};

type GameState = {
  grid: [number][];
};
const generateGameState = (x: number, y: number): GameState => ({
  grid: Array(y).fill(Array(x).fill(0)),
});

export const GameArea = ({
  pieces,
  setPieces,
}: {
  pieces: Piece[];
  setPieces: (pieces: Piece[]) => void;
}) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>(
    generateGameState(12, 6)
  );

  const [state, dispatch] = useReducer<
    Reducer<GameAreaDragState, GameAreaAction>
  >(reducer, initialState);

  const handleMouseDown = useCallback((event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    if (isMouseDownOnPiece(target)) {
      dispatch({
        type: "MOUSE_DOWN",
        position: { x: event.clientX, y: event.clientY },
        activePieceId: target.id.split("-")?.[1],
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!state.isMouseDown) return;
      if (!state.activePieceId) return;
      dispatch({
        type: "DRAG_MOVE",
        position: { x: event.clientX, y: event.clientY },
      });
    },
    [state.activePieceId, state.isMouseDown]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (state.isDragging) {
        setPieces(
          pieces.map((piece) => {
            return state.activePieceId === piece.id
              ? {
                  ...piece,
                  isActivePiece: false,
                  position: {
                    x:
                      (state.dragPosition?.x ?? 0) -
                      (state.onMouseDownPosition?.x ?? 0) +
                      piece.position.x,
                    y:
                      (state.dragPosition?.y ?? 0) -
                      (state.onMouseDownPosition?.y ?? 0) +
                      piece.position.y,
                  },
                  onMouseDownPosition: undefined,
                  dragPosition: undefined,
                }
              : piece;
          })
        );
      }
      dispatch({ type: "MOUSE_UP" });
    },
    [pieces, setPieces, state]
  );

  return (
    <div
      ref={gameAreaRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Board boardRef={boardRef} />
      <Pieces
        pieces={pieces}
        activePieceId={state.activePieceId}
        state={state}
      />
    </div>
  );
};

const isMouseDownOnPiece = (target: HTMLElement): boolean => {
  return (
    target.id.includes("piece") ||
    (target.id === "board" && hasClickedPlacedPiece())
  );
  // TODO: this doesn't work if the pieces are overlapping, need to calc the xy of the pieces
};

const hasClickedPlacedPiece = (): boolean => {
  return true;
};
