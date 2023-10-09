import { useCallback, useRef } from "react";
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
  calcRotatedInitialPiecePosition,
  isRotatedSideways,
} from "../../../utils/utils";
import { useGameContext } from "../../../../GameContext";
import type {
  MouseEvent,
  Dispatch,
  SetStateAction,
  RefObject,
  TouchEvent,
  Touch,
} from "react";
import type { GameAreaAction, GameAreaDragState } from "../types";
import type { GameState, Piece } from "../../../types";

type SwipePosition = {
  clientX: number;
  clientY: number;
};

type SwipedPiece = {
  id: number;
  pieceBounds: { top: number; left: number; right: number; bottom: number };
};

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
  const { cellSize, hasFx } = useGameContext();

  // Will be set on touch start if the touch isn't on a piece
  const swipeStartPosition = useRef<SwipePosition>();
  // Will be set on touch move if the touch intersects a piece
  const swipedPiece = useRef<SwipedPiece>();

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
      if (event.touches.length > 1) return;

      const touchEvent = event.touches[0];
      
      const target = touchEvent.target as HTMLElement;
      const touchPosition = {
        clientX: touchEvent.clientX,
        clientY: touchEvent.clientY,
      };

      // if touch outside a piece, initiate a swipe and prevent a drag or rotation
      const touchedPieceId = getPieceIdOnMouseDown(target, pieces);
      if (!touchedPieceId) {
        console.log("swipe start");
        swipeStartPosition.current = touchPosition;
        return;
      }
      console.log({ touchedPieceId });

      // else do onMouseDown
      onMouseDown(target, touchPosition);
    },
    [onMouseDown, pieces]
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

              playFx("/over-board.mp3", hasFx);
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
      hasFx,
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
      const touchEvent = event.changedTouches[0];
      if (swipeStartPosition.current && boardBounds) {
        const piece = getPieceBoundsOnSwipe(touchEvent, pieces, cellSize);

        // If the swipe intersected a piece
        if (swipedPiece.current) {
          // But is no longer intersecting a piece, then flip it
          if (!piece) {
            // If click on placed board piece but didn't drag, rotate it and remove from board grid (unplace it)
            playFx("/transform.mp3", hasFx);

            setPieces(
              updatePiecesWithFlippedPiece(
                pieces,
                swipedPiece.current.id,
                isActivePieceOverBoard(
                  swipedPiece.current.pieceBounds,
                  boardBounds,
                  cellSize
                ),
                getSwipeDirection(swipeStartPosition.current, touchEvent)
              )
            );

            swipeStartPosition.current = undefined;
          }
          return;
        }

        // Swipe has intersected a piece
        if (piece) {
          swipedPiece.current = piece;
          return;
        }
      }

      onMove(touchEvent);
    },
    [boardBounds, cellSize, hasFx, onMove, pieces, setPieces]
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
          playFx("/place.mp3", hasFx);

          const updatedGrid = addPieceToBoard(
            gameState.grid,
            state.previewPiece.cells
          );

          const complete = updatedGrid.every((row) =>
            row.every((cell) => cell)
          );

          // Delay setting game state on complete to allow piece to animate into place first
          setTimeout(
            () => {
              setGameState({
                ...gameState,
                grid: updatedGrid,
                complete,
                moves: gameState.moves + 1,
              });
            },
            complete ? 500 : 0
          );
        } else {
          playFx("/drop.mp3", hasFx);
        }
      } else {
        const activePiece = pieces.find(
          (piece) => piece.id === state.activePieceId
        );
        const pieceBounds = activePieceRef.current?.getBoundingClientRect();

        if (state.activePieceId && pieceBounds && boardBounds) {
          // If click on placed board piece but didn't drag, rotate it and remove from board grid (unplace it)
          playFx("/transform.mp3", hasFx);

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
      hasFx,
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

      // Tidy up the swipe event and return early to prevent onMouseUp running
      if (swipeStartPosition.current || swipedPiece.current) {
        swipeStartPosition.current = undefined;
        swipedPiece.current = undefined;
        return;
      }

      onMouseUp(event.touches[0], false, false);
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

const getSwipeDirection = (
  startPosition: SwipePosition,
  endPosition: SwipePosition
) => {
  const xDiff = Math.abs(endPosition.clientX - startPosition.clientX);
  const yDiff = Math.abs(endPosition.clientY - startPosition.clientY);
  return xDiff < yDiff ? "x" : "y";
};

const getPieceBoundsOnSwipe = (
  event: Touch,
  pieces: Piece[],
  cellSize: number
): SwipedPiece | undefined => {
  for (const piece of pieces) {
    const pieceWidth = piece.currentShape[0].length * cellSize;
    const pieceHeight = piece.currentShape.length * cellSize;
    const piecePosition = calcRotatedInitialPiecePosition(
      {
        width: pieceWidth,
        height: pieceHeight,
      },
      piece.rotation,
      {
        x: piece.initialPosition.x + piece.position.x,
        y: piece.initialPosition.y + piece.position.y,
      },
      false
    );

    const pieceBounds = {
      top: piecePosition.y,
      left: piecePosition.x,
      bottom:
        piecePosition.y +
        (isRotatedSideways(piece.rotation) ? pieceWidth : pieceHeight),
      right:
        piecePosition.x +
        (isRotatedSideways(piece.rotation) ? pieceHeight : pieceWidth),
    };

    if (
      pieceBounds.top < event.clientY &&
      pieceBounds.bottom > event.clientY &&
      pieceBounds.left < event.clientX &&
      pieceBounds.right > event.clientX
    ) {
      return {
        id: piece.id,
        pieceBounds,
      };
    }
  }
};

const playFx = (path: string, hasFx: boolean, volume = 0.7) => {
  if (hasFx) {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play();
  }
};

export const onButtonHover = (hasFx: boolean) => {
  playFx("/button-hover.mp3", hasFx, 0.2);
};

export const onButtonClick = (hasFx: boolean) => {
  playFx("/button-click.mp3", hasFx, 0.4);
};
