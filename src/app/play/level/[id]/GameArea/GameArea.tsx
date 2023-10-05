import { Board } from "../../components/Board";
import { Pieces } from "../../components/Pieces";
import { useRef, useState, useReducer, useEffect } from "react";
import { LevelComplete } from "../LevelComplete";
import { LevelLocalStorage, useLocalStorage } from "../hooks/useLocalStorage";
import { initialState, reducer } from "./reducer";
import { useEventHandlers } from "./hooks/useEventHandlers";
import type { Reducer } from "react";
import type { GameAreaAction, GameAreaDragState } from "./types";
import type { Piece, PlacedPiece } from "../../types";
import { useGameState } from "./hooks/useGameState";
import gameAreaStyles from "../../../level/styles/gameArea.module.css";

type GameAreaProps = {
  placedPieces: PlacedPiece[];
  unplacedPieces: Piece[];
  initialLocalStorageData?: LevelLocalStorage;
  level: number;
};

export const GameArea = ({
  placedPieces,
  unplacedPieces,
  initialLocalStorageData,
  level,
}: GameAreaProps) => {
  const [gameState, setGameState] = useGameState(
    level,
    placedPieces,
    initialLocalStorageData
  );

  const [pieces, setPieces] = useState(unplacedPieces);
  const [boardAnimationComplete, setBoardAnimationComplete] = useState(false);

  const { setLocalStoragePlacedPieces } = useLocalStorage(level);

  const [state, dispatch] = useReducer<
    Reducer<GameAreaDragState, GameAreaAction>
  >(reducer, initialState);

  const boardRef = useRef<HTMLDivElement>(null);
  const activePieceRef = useRef<HTMLDivElement>(null);

  const boardBounds = boardRef.current?.getBoundingClientRect();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useEventHandlers({
    pieces,
    setPieces,
    state,
    dispatch,
    gameState,
    setGameState,
    activePieceRef,
    boardBounds,
  });

  // Sync placed pices to local storage whenever pieces changes
  useEffect(() => {
    setLocalStoragePlacedPieces(pieces);
  }, [pieces, setLocalStoragePlacedPieces]);

  return (
    <>
      <div
        className={gameAreaStyles.gameArea}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleMouseUp}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Board
          boardRef={boardRef}
          previewPiece={state.previewPiece}
          prePlacedPieces={placedPieces}
          setBoardAnimationComplete={setBoardAnimationComplete}
        />
        <Pieces
          pieces={pieces}
          setPieces={setPieces}
          activePieceId={state.activePieceId}
          state={state}
          ref={activePieceRef}
          boardBounds={boardBounds}
          boardAnimationComplete={boardAnimationComplete}
        />
      </div>
      <LevelComplete
        moves={gameState.moves}
        startDate={gameState.startDate}
        isVisible={gameState.complete}
      />
    </>
  );
};
