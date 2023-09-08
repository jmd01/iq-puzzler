import { GameAreaAction, GameAreaDragState } from "./types";

export const initialState: GameAreaDragState = {
    isMouseDown: false,
    isDragging: false,
    activePieceId: undefined,
    onMouseDownPosition: undefined,
    dragPosition: undefined,
    previewPiece: undefined,
  };
  

export const reducer = (state: GameAreaDragState, action: GameAreaAction) => {
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