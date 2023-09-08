import { Piece, PreviewPiece } from "../../types";

export type GameAreaAction =
  | {
      type: "MOUSE_DOWN";
      position: { x: number; y: number };
      activePieceId: Piece["id"];
    }
  | { type: "MOUSE_UP" }
  | { type: "DRAG_MOVE"; position: { x: number; y: number } }
  | { type: "DRAG_OVER_BOARD"; previewPiece: PreviewPiece }
  | { type: "DRAG_OUTSIDE_BOARD" };

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
  