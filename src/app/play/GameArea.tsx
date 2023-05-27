import { Board } from "./Board";
import { Pieces } from "./Pieces";
import {
  useRef,
  useState,
  MouseEvent,
  useCallback,
  useReducer,
  Dispatch,
  SetStateAction,
} from "react";
import type { Reducer } from "react";
import {
  addPieceToBoard,
  boardsCellsCoveredByPiece,
  cellSize,
  generateGameState,
  isActivePieceOverBoard,
} from "./utils";
import type { GameState, Piece, PreviewPiece } from "./types";

export type GameAreaDragState = {
  isMouseDown: boolean;
  isDragging: boolean;
  activePieceId?: Piece["id"];
  onMouseDownPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
  /**
   *  Render a preview of where the active piece will drop on the board.
   * Will only exist if the current position of the piece is placeble
   */
  previewPiece?: PreviewPiece;
};

const initialState: GameAreaDragState = {
  isMouseDown: false,
  isDragging: false,
  activePieceId: undefined,
  onMouseDownPosition: undefined,
  dragPosition: undefined,
  previewPiece: undefined,
};

type GameAreaAction =
  | {
      type: "MOUSE_DOWN";
      position: { x: number; y: number };
      activePieceId: Piece["id"];
    }
  | { type: "MOUSE_UP" }
  | { type: "DRAG_MOVE"; position: { x: number; y: number } }
  | { type: "DRAG_OVER_BOARD"; previewPiece: PreviewPiece };

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
        previewPiece: undefined,
      };
    case "DRAG_MOVE":
      return {
        ...state,
        isDragging: true,
        dragPosition: action.position,
      };
    case "DRAG_OVER_BOARD":
      return {
        ...state,
        previewPiece: action.previewPiece,
      };
    default:
      throw new Error();
  }
};

export const GameArea = ({
  pieces,
  setPieces,
}: {
  pieces: Piece[];
  setPieces: Dispatch<SetStateAction<Piece[]>>;
}) => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const activePieceRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>(
    generateGameState(12, 6)
  );
  // console.log(gameState);

  const boardBounds = boardRef.current?.getBoundingClientRect();

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

      if (activePieceRef.current && boardBounds) {
        const pieceBounds = activePieceRef.current.getBoundingClientRect();

        const buffer = cellSize / 2;

        // active piece is overboard
        if (isActivePieceOverBoard(pieceBounds, boardBounds, buffer)) {
          const activePiece = pieces.find(
            ({ id }) => id === state.activePieceId
          );
          if (activePiece) {
            const previewPiece = boardsCellsCoveredByPiece(
              pieceBounds,
              boardBounds,
              activePiece.shape
            );
            previewPiece &&
              dispatch({
                type: "DRAG_OVER_BOARD",
                previewPiece,
              });
          }
        }
      }
    },
    [boardBounds, pieces, state.activePieceId, state.isMouseDown]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (state.isDragging) {
        setPieces(
          pieces.map((piece) => {
            if (state.activePieceId === piece.id && boardBounds) {
              let newPosition = { x: 0, y: 0 };
              // Piece was dropped on board in a placeable position
              if (state.previewPiece) {
                newPosition = {
                  x:
                    boardBounds.left +
                    state.previewPiece.x * cellSize -
                    piece.initialPosition.x,
                  y:
                    boardBounds.top +
                    state.previewPiece.y * cellSize -
                    piece.initialPosition.y,
                };

                const updatedGrid = addPieceToBoard(
                  gameState.grid,
                  state.previewPiece.cells
                );
                console.log({ updatedGrid });

                setGameState({
                  ...gameState,
                  grid: updatedGrid,
                });
              } else {
                newPosition = {
                  x:
                    (state.dragPosition?.x ?? 0) -
                    (state.onMouseDownPosition?.x ?? 0) +
                    piece.position.x,
                  y:
                    (state.dragPosition?.y ?? 0) -
                    (state.onMouseDownPosition?.y ?? 0) +
                    piece.position.y,
                };
              }

              return {
                ...piece,
                isActivePiece: false,
                position: newPosition,
                onMouseDownPosition: undefined,
                dragPosition: undefined,
              };
            } else {
              return piece;
            }
          })
        );
      }
      dispatch({ type: "MOUSE_UP" });
    },
    [
      state.isDragging,
      state.activePieceId,
      state.previewPiece,
      state.dragPosition?.x,
      state.dragPosition?.y,
      state.onMouseDownPosition?.x,
      state.onMouseDownPosition?.y,
      setPieces,
      pieces,
      boardBounds,
      gameState,
    ]
  );

  return (
    <div
      ref={gameAreaRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Board boardRef={boardRef} previewPiece={state.previewPiece} />
      <Pieces
        pieces={pieces}
        setPieces={setPieces}
        activePieceId={state.activePieceId}
        state={state}
        ref={activePieceRef}
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
