import { useCallback } from "react";
import {
  removePieceFromBoard,
  addPieceToBoard,
} from "../../../utils/sharedUtils";
import {
  getPieceIdOnMouseDown,
  DRAG_START_THRESHOLD,
  isActivePieceOverBoard,
  boardsCellsCoveredByPiece,
  calcPlacedPosition,
  calcUnplacedPosition,
  updatePiecesWithFlippedPiece,
  updatePiecesWithRotatedPiece,
} from "../../../utils/utils";
import { useGameContext } from "../../../../GameContext";
import type {
  MouseEvent,
  Dispatch,
  SetStateAction,
  RefObject,
  TouchEvent,
} from "react";
import type { GameAreaAction, GameAreaDragState } from "../types";
import type { GameState, Piece } from "../../../types";

export const useEventHandlers = ({
  pieces,
  setPieces,
  state,
  dispatch,
  gameState,
  setGameState,
  activePieceRef,
  boardBounds,
}: {
  pieces: Piece[];
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  state: GameAreaDragState;
  dispatch: Dispatch<GameAreaAction>;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  activePieceRef: RefObject<HTMLDivElement>;
  boardBounds: DOMRect | undefined;
}) => {
  const { cellSize } = useGameContext();

  const onMouseDown = useCallback(
    (target: HTMLElement, event: { clientX: number; clientY: number }) => {
      const clickedPieceId = getPieceIdOnMouseDown(target, pieces);

      if (clickedPieceId) {
        dispatch({
          type: "MOUSE_DOWN",
          position: { x: event.clientX, y: event.clientY },
          activePieceId: clickedPieceId,
        });

        // Reorder pieces so that the active piece is on top
        const activePiece = pieces.find((piece) => piece.id === clickedPieceId);
        if (activePiece) {
          setPieces(
            pieces.map((piece) => {
              return piece.id === clickedPieceId
                ? {
                    ...piece,
                    layer: pieces.length,
                  }
                : {
                    ...piece,
                    layer:
                      piece.layer > activePiece?.layer
                        ? piece.layer - 1
                        : piece.layer,
                  };
            })
          );
        }
      }
    },
    [dispatch, pieces, setPieces]
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      return onMouseDown(event.target as HTMLElement, {
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [onMouseDown]
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touchEvent = event.touches[0];
      onMouseDown(touchEvent.target as HTMLElement, {
        clientX: touchEvent.clientX,
        clientY: touchEvent.clientY,
      });
    },
    [onMouseDown]
  );

  const onMove = useCallback(
    (event: { clientX: number; clientY: number }) => {
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
          complete: false,
          grid: removePieceFromBoard(gameState.grid, activePiece.placedInCells),
        });

        setPieces(
          pieces.map((piece) =>
            piece.id === state.activePieceId
              ? {
                  ...piece,
                  placedInCells: undefined,
                  droppedOnBoard: false,
                }
              : piece
          )
        );
      }

      if (activePieceRef.current && boardBounds) {
        const pieceBounds = activePieceRef.current.getBoundingClientRect();

        // If active piece is over the board, determine if it is in a placeable position. If it is, render a preview of where it will drop
        if (isActivePieceOverBoard(pieceBounds, boardBounds, cellSize)) {
          const activePiece = pieces.find(
            ({ id }) => id === state.activePieceId
          );
          if (activePiece) {
            const previewPiece = boardsCellsCoveredByPiece(
              pieceBounds,
              boardBounds,
              activePiece.currentShape,
              gameState.grid,
              cellSize
            );

            if (
              previewPiece &&
              JSON.stringify(state?.previewPiece) !==
                JSON.stringify(previewPiece)
            ) {
              dispatch({
                type: "DRAG_OVER_BOARD",
                previewPiece,
              });

              new Audio("/over-board.mp3").play();
            }
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
      activePieceRef,
      boardBounds,
      cellSize,
      dispatch,
      gameState,
      pieces,
      setGameState,
      setPieces,
      state.activePieceId,
      state.isMouseDown,
      state.onMouseDownPosition,
      state?.previewPiece,
    ]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      onMove(event);
    },
    [onMove]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touchEvent = event.touches[0];
      onMove(touchEvent);
    },
    [onMove]
  );

  const onMouseUp = useCallback(
    (
      event: { clientX: number; clientY: number },
      flipX?: boolean,
      flipY?: boolean
    ) => {
      // On drag end, update active piece position and if placeable, set its placedInCells value and clear any drag related state
      if (state.isDragging) {
        setPieces(
          pieces.map((piece) => {
            if (
              state.activePieceId === piece.id &&
              activePieceRef.current &&
              boardBounds
            ) {
              const pieceBounds =
                activePieceRef.current.getBoundingClientRect();

              return {
                ...piece,
                isActivePiece: false,
                position: state.previewPiece
                  ? calcPlacedPosition(
                      piece,
                      pieceBounds,
                      boardBounds,
                      state.previewPiece,
                      cellSize
                    )
                  : calcUnplacedPosition(
                      piece,
                      state.dragPosition,
                      state.onMouseDownPosition
                    ),
                onMouseDownPosition: undefined,
                dragPosition: undefined,
                placedInCells: state.previewPiece?.cells,
                droppedOnBoard: !!state.previewPiece,
              };
            } else {
              return piece;
            }
          })
        );

        // If piece was dropped on the board in a placeable position, add it to the board grid and check if grid is full (i.e game complete)
        if (state.previewPiece) {
          const updatedGrid = addPieceToBoard(
            gameState.grid,
            state.previewPiece.cells
          );

          const complete = updatedGrid.every((row) =>
            row.every((cell) => cell)
          );
          setGameState({
            ...gameState,
            grid: updatedGrid,
            complete,
            moves: gameState.moves + 1,
          });
          new Audio("/place.mp3").play();
        } else {
          new Audio("/drop.mp3").play();
        }
      } else {
        // If click on placed board piece but didn't drag, rotate it and remove from board grid (unplace it)
        new Audio("/transform.mp3").play();

        const activePiece = pieces.find(
          (piece) => piece.id === state.activePieceId
        );
        const pieceBounds = activePieceRef.current?.getBoundingClientRect();

        if (
          // activePiece?.placedInCells &&
          state.activePieceId &&
          pieceBounds &&
          boardBounds
        ) {
          setPieces(
            flipX || flipY
              ? updatePiecesWithFlippedPiece(
                  pieces,
                  state.activePieceId,
                  isActivePieceOverBoard(pieceBounds, boardBounds, cellSize),
                  flipX ? "x" : "y"
                )
              : updatePiecesWithRotatedPiece(
                  pieces,
                  state.activePieceId,
                  isActivePieceOverBoard(pieceBounds, boardBounds, cellSize)
                )
          );

          if (activePiece?.placedInCells) {
            setGameState({
              ...gameState,
              complete: false,
              grid: removePieceFromBoard(
                gameState.grid,
                activePiece.placedInCells
              ),
            });
          }
        }
      }

      dispatch({ type: "MOUSE_UP" });
    },
    [
      activePieceRef,
      boardBounds,
      cellSize,
      dispatch,
      gameState,
      pieces,
      setGameState,
      setPieces,
      state.activePieceId,
      state.dragPosition,
      state.isDragging,
      state.onMouseDownPosition,
      state.previewPiece,
    ]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      console.log("mouse up");
      const flipX = event.ctrlKey || event.metaKey;
      const flipY = event.shiftKey;
      onMouseUp(event, flipX, flipY);
    },
    [onMouseUp]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      // Prevent firing of mouse events after touch events
      event.preventDefault();

      const touchEvent = event.touches[0];
      onMouseUp(touchEvent, false, false);
    },
    [onMouseUp]
  );

  const handleContextMenu = (event: MouseEvent) => event.preventDefault();

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};