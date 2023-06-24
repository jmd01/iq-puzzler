"use client";
import { Board } from "./Board";
import Logo from "./Logo";
import { Pieces } from "./Pieces";
import {
  useRef,
  useState,
  MouseEvent,
  useCallback,
  useReducer,
  useLayoutEffect,
  useEffect,
} from "react";
import type { Reducer } from "react";
import {
  addPieceToBoard,
  boardsCellsCoveredByPiece,
  calcPlacedPosition,
  calcUnplacedPosition,
  DRAG_START_THRESHOLD,
  getPieceIdOnMouseDown,
  isActivePieceOverBoard,
  removePieceFromBoard,
  updatePiecesWithFlippedPiece,
  updatePiecesWithRotatedPiece,
} from "./utils";
import { generateGameState } from "./generateGameState";
import type { GameState, Piece, PlacedPiece, PreviewPiece } from "./types";
import { Animate, AnimateKeyframes } from "react-simple-animate";

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
        activePieceId: undefined,
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

type GameAreaProps = {
  placedPieces: PlacedPiece[];
  unplacedPieces: Piece[];
};
export const GameArea = ({ placedPieces, unplacedPieces }: GameAreaProps) => {
  const [gameState, setGameState] = useState<GameState>(
    generateGameState(11, 5, placedPieces)
  );

  const [prePlacedPieces] = useState(placedPieces);
  const [pieces, setPieces] = useState(unplacedPieces);

  const [gameAreaDims, setGameAreaDims] = useState<{
    width: number | string;
    height: number | string;
  }>({
    height: "100%",
    width: "100%",
  });

  const [state, dispatch] = useReducer<
    Reducer<GameAreaDragState, GameAreaAction>
  >(reducer, initialState);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const activePieceRef = useRef<HTMLDivElement>(null);

  const boardBounds = boardRef.current?.getBoundingClientRect();

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0) return;

      const target = event.target as HTMLElement;
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
        if (isActivePieceOverBoard(pieceBounds, boardBounds)) {
          const activePiece = pieces.find(
            ({ id }) => id === state.activePieceId
          );
          if (activePiece) {
            const previewPiece = boardsCellsCoveredByPiece(
              pieceBounds,
              boardBounds,
              activePiece.shape,
              activePiece.rotation,
              activePiece.isFlippedX,
              activePiece.isFlippedY,
              gameState.grid
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
                      state.previewPiece
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
            grid: updatedGrid,
            complete,
          });
        }
      } else {
        // If click on placed board piece but didn't drag, rotate it and remove from board grid (unplace it)
        const activePiece = pieces.find(
          (piece) => piece.id === state.activePieceId
        );
        const pieceBounds = activePieceRef.current?.getBoundingClientRect();

        if (
          activePiece?.placedInCells &&
          state.activePieceId &&
          pieceBounds &&
          boardBounds
        ) {
          setPieces(
            event.ctrlKey || event.metaKey || event.shiftKey
              ? updatePiecesWithFlippedPiece(
                  pieces,
                  state.activePieceId,
                  isActivePieceOverBoard(pieceBounds, boardBounds),
                  event.ctrlKey || event.metaKey ? "x" : "y"
                )
              : updatePiecesWithRotatedPiece(
                  pieces,
                  state.activePieceId,
                  isActivePieceOverBoard(pieceBounds, boardBounds)
                )
          );
          setGameState({
            complete: false,
            grid: removePieceFromBoard(
              gameState.grid,
              activePiece.placedInCells
            ),
          });
        }
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
      gameState,
    ]
  );

  const onContextMenu = (event: MouseEvent) => event.preventDefault();

  useLayoutEffect(() => {
    if (gameState.complete) {
      alert("You win!");
    }
  }, [gameState.complete]);

  // Fix the window size to 100% on first load
  useEffect(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current?.getBoundingClientRect();
      setGameAreaDims({
        width,
        height,
      });
    }
  }, []);

  return (
    <div
      ref={gameAreaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleMouseUp}
      onContextMenu={onContextMenu}
      style={{
        width: gameAreaDims.width,
        height: gameAreaDims.height,
        backgroundImage: `
        radial-gradient(
          circle at 5% 20%, 
          rgba(255,255,255,0.1) 2%, 
          rgba(255,255,255,0) 40%, 
          rgba(255,255,255,0.05) 80%,
          rgba(255,255,255,0) 100%
          ),
          linear-gradient(135deg, #04012f, #1e012f)
          `,
      }}
    >
      {/* Top left radial gradient */}
      <AnimateKeyframes
        play
        iterationCount="infinite"
        direction="alternate"
        easeType="ease-in-out"
        duration={10}
        keyframes={[
          { 0: "opacity: 0.6" },
          { 70: "opacity: 0.9" },
          { 100: "opacity: 1" },
        ]}
        render={({ style }) => {
          return (
            <div
              style={{
                width: 500,
                height: 700,
                position: "absolute",
                backgroundImage: `        
                  radial-gradient(
                    farthest-corner at 3% 5%,
                    rgba(67, 19, 180, 0.9) 0%, 
                    transparent 50% 
                    )
                `,
                pointerEvents: "none",
                ...style,
              }}
            />
          );
        }}
      />
      {/* Moving radial gradient */}
      <AnimateKeyframes
        play
        iterationCount="infinite"
        direction="alternate"
        easeType="linear"
        duration={8}
        keyframes={[
          { 0: "opacity: 0.4" },
          { 50: "opacity: 0.8" },
          { 100: "opacity: 0.5" },
        ]}
        render={({ style }) => {
          return (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                backgroundImage: `        
                  radial-gradient(
                    ellipse at 10% 120%,
                    rgba(64, 255, 0, 0.5) 0%, 
                    transparent 50% 
                    ),
                  radial-gradient(
                    90em 50em at 13% 120%,
                    rgba(64, 255, 0, 0.5) 0%, 
                    transparent 50% 
                    ),
                  radial-gradient(
                    70% 130% at 115% -10%,
                    rgba(0, 247, 255, 0.5) 0%, 
                    transparent 50% 
                    ),
                  radial-gradient(
                    60% 120% at 120% 25%,
                    rgba(0, 247, 255, 0.5) 0%, 
                    transparent 50% 
                    )
                `,
                // transform: "translate3d(-20%, 75%, 0)",
                pointerEvents: "none",
                ...style,
              }}
            />
          );
        }}
      />
      {/* <AnimateKeyframes
        play
        iterationCount="infinite"
        direction="alternate"
        easeType="ease-in-out"
        duration={10}
        keyframes={[
          {
            0: "transform-origin: 0 100%; transform: scaleY(0.8)",
          },
          // {
          //   50: "transform-origin: 0 100%; opacity: 0.6; transform: translate(20%, -15%, 0) scaleY(1.3)",
          // },
          // {
          //   70: "transform-origin: 0 100%; transform: translate(15%, -25%, 0) scaleX(1.3)",
          // },
          {
            100: "transform-origin: 0 100%; opacity: 0.7; transform: scaleX(0.8) scaleY(2) ",
          },
        ]}
        render={({ style }) => {
          return (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                backgroundImage: `        
                  radial-gradient(
                    rgba(35, 146, 237, 0.7) 0%, 
                    transparent 60% 
                    )
                `,
                pointerEvents: "none",
                ...style,
              }}
            />
          );
        }}
      /> */}
      {/* Bottom right linear gradient */}
      <AnimateKeyframes
        play
        iterationCount="infinite"
        direction="alternate"
        easeType="ease-in-out"
        duration={5}
        keyframes={[
          { 0: "opacity: 0.75" },
          { 30: "opacity: 0.9" },
          { 100: "opacity: 1" },
        ]}
        render={({ style }) => {
          return (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                backgroundImage: `
                linear-gradient(135deg, transparent 80%, rgba(45, 11, 123, 0.9));        
                `,
                ...style,
              }}
            />
          );
        }}
      />

      <div className="flex justify-center p-8">
        {/* <AnimateKeyframes
          play
          iterationCount="infinite"
          direction="alternate"
          easeType="ease-in"
          duration={5}
          keyframes={[
            { 0: "opacity: 0.75" },
            { 70: "opacity: 0.9" },
            { 100: "opacity: 1" },
          ]}
          render={({ style }) => { 
          return ( */}
        <Logo fill="#3a287a" /*style={style}*/ width={80} />;
        {/* )
           }}
        /> */}
      </div>
      <Board
        boardRef={boardRef}
        previewPiece={state.previewPiece}
        prePlacedPieces={prePlacedPieces}
      />
      <Pieces
        pieces={pieces}
        setPieces={setPieces}
        activePieceId={state.activePieceId}
        state={state}
        ref={activePieceRef}
        boardBounds={boardBounds}
      />
    </div>
  );
};
