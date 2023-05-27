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
  use,
  useEffect,
} from "react";
import type { Reducer } from "react";
import {
  addPieceToBoard,
  boardsCellsCoveredByPiece,
  calcPlacedPosition,
  calcUnplacedPosition,
  CELL_SIZE,
  DRAG_START_THRESHOLD,
  generateGameState,
  getPieceIdOnMouseDown,
  isActivePieceOverBoard,
  removePieceFromBoard,
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
  | { type: "DRAG_OVER_BOARD"; previewPiece: PreviewPiece }
  | { type: "DRAG_OUTSIDE_BOARD" };

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
    case "DRAG_OUTSIDE_BOARD":
      return {
        ...state,
        previewPiece: undefined,
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
  const [gameState, setGameState] = useState<GameState>(
    generateGameState(12, 6)
  );
  const [state, dispatch] = useReducer<
    Reducer<GameAreaDragState, GameAreaAction>
  >(reducer, initialState);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const activePieceRef = useRef<HTMLDivElement>(null);

  const boardBounds = boardRef.current?.getBoundingClientRect();

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      const clickedPieceId = getPieceIdOnMouseDown(target, pieces);

      if (clickedPieceId) {
        dispatch({
          type: "MOUSE_DOWN",
          position: { x: event.clientX, y: event.clientY },
          activePieceId: clickedPieceId,
        });
      }
    },
    [pieces]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      // Prevent drags on the board getting in the way of a drag on a piece
      event.preventDefault();

      // Early return if no piece is being dragged or dragging has not exceeded the threshold in any direction
      if (!state.isMouseDown) return;
      if (!state.activePieceId) return;
      if (
        !state.onMouseDownPosition ||
        (Math.abs(state.onMouseDownPosition?.x - event.clientX) <
          DRAG_START_THRESHOLD &&
          Math.abs(state.onMouseDownPosition?.y - event.clientY) <
            DRAG_START_THRESHOLD)
      )
        return;

      dispatch({
        type: "DRAG_MOVE",
        position: { x: event.clientX, y: event.clientY },
      });

      // If active piece is already placed on the board, remove it and unset placedInCells value
      const activePiece = pieces.find(
        (piece) => piece.id === state.activePieceId
      );
      if (activePiece && activePiece.placedInCells) {
        setGameState({
          ...gameState,
          grid: removePieceFromBoard(gameState.grid, activePiece.placedInCells),
        });

        setPieces(
          pieces.map((piece) =>
            piece.id === state.activePieceId
              ? { ...piece, placedInCells: undefined }
              : piece
          )
        );
      }

      if (activePieceRef.current && boardBounds) {
        const pieceBounds = activePieceRef.current.getBoundingClientRect();

        // If active piece is over the board, determine if it is in a placeable position. If it is, render a preview of where it will drop
        if (isActivePieceOverBoard(pieceBounds, boardBounds)) {
          const activePiece = pieces.find(
            ({ id }) => id === state.activePieceId
          );
          if (activePiece) {
            const previewPiece = boardsCellsCoveredByPiece(
              pieceBounds,
              boardBounds,
              activePiece.shape,
            );
            previewPiece &&
              dispatch({
                type: "DRAG_OVER_BOARD",
                previewPiece,
              });
            return;
          }
        }

        // If active piece is not over the board, remove any existing preview piece
        dispatch({
          type: "DRAG_OUTSIDE_BOARD",
        });
      }
    },
    [
      boardBounds,
      gameState,
      pieces,
      setPieces,
      state.activePieceId,
      state.isMouseDown,
      state.onMouseDownPosition,
    ]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (state.isDragging) {
        setPieces(
          pieces.map((piece) => {
            if (state.activePieceId === piece.id && boardBounds) {
              return {
                ...piece,
                isActivePiece: false,
                position: state.previewPiece
                  ? calcPlacedPosition(piece, boardBounds, state.previewPiece)
                  : calcUnplacedPosition(
                      piece,
                      state.dragPosition,
                      state.onMouseDownPosition
                    ),
                onMouseDownPosition: undefined,
                dragPosition: undefined,
                placedInCells: state.previewPiece?.cells,
              };
            } else {
              return piece;
            }
          })
        );
      }

      if (state.previewPiece) {
        const updatedGrid = addPieceToBoard(
          gameState.grid,
          state.previewPiece.cells
        );

        const complete = updatedGrid.every((row) => row.every((cell) => cell));
        setGameState({
          grid: updatedGrid,
          complete,
        });
      }

      dispatch({ type: "MOUSE_UP" });
    },
    [
      state.isDragging,
      state.previewPiece,
      state.activePieceId,
      state.dragPosition,
      state.onMouseDownPosition,
      setPieces,
      pieces,
      boardBounds,
      gameState.grid,
    ]
  );

  useEffect(() => {
    if (gameState.complete) {
      alert("You win!");
    }
  }, [gameState.complete]);

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
