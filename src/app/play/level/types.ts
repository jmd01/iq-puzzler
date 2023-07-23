import * as z from "zod";

export type Rotation = number;

export type PieceData = {
  id: number;
  /** Sets the zindex on unplaced pieces so the most recently moved piece appears on top */
  layer: number;
  rotation: Rotation;
  isFlippedX: boolean;
  isFlippedY: boolean;
  shape: number[][];
  /** If piece is placed on board this is the index of the cells the piece is placed in see @PreviewPiece["cells"]. Will undefined if piece is not placed on board */
  placedInCells: PreviewPiece["cells"];
  height: number;
  width: number;
  d: string;
  color: string;
};

export const pieceDataSchema = z.object({
  id: z.number(),
  layer: z.number(),
  rotation: z.number(),
  isFlippedX: z.boolean(),
  isFlippedY: z.boolean(),
  shape: z.array(z.array(z.number())),
  placedInCells: z.array(z.tuple([z.number(), z.number()])),
  height: z.number(),
  width: z.number(),
  d: z.string(),
  color: z.string(),
});

export const piecesDataSchema = z.array(pieceDataSchema);

export type Piece = Omit<PieceData, "placedInCells"> & {
  initialPosition: { x: number; y: number };
  position: { x: number; y: number };
  isActivePiece: boolean;
  onMouseDownPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
  /** If piece is dropped on board but not placed. This is used to give a visual indicator, since it could appear placed if perfectly aligned with the grid */
  droppedOnBoard: boolean;
  /** If piece is pre-placed on board it should not be draggable */
  isLocked: boolean;
  placedInCells?: PreviewPiece["cells"];
  currentShape: number[][];
};

export type PlacedPiece = Omit<Piece, "placedInCells"> & {
  placedInCells: PreviewPiece["cells"];
};

/** Represent where an active piece will be dropped on the board */
export type PreviewPiece = {
  /** The index of the board cell on the x axis that the active piece will be placed on  */
  x: number;
  /** The index of the board cell on the y axis that the active piece will be placed on  */
  y: number;
  /** An array of the zero indexed [x,y] of the cells on the board that the active piece will be placed on, eg a cross shaped piece dropped in the top left would be
   * ```
   *    o
   *  o o o
   *    o
   *    o
   * ```
   * [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]]
   *
   */
  cells: [number, number][];
};
export type GameState = {
  grid: number[][];
  complete: boolean;
  moves: number;
  startDate: Date;
};

export type Difficulty = "EASY" | "INTERMEDIATE" | "EXPERT" | "WIZARD";

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
