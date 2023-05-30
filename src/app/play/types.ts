export type Rotation = 0 | 0.25 | 0.5 | 0.75;
export type Piece = {
  id: string;
  initialPosition: { x: number; y: number };
  position: { x: number; y: number };
  rotation: Rotation;
  shape: number[][];
  isActivePiece: boolean;
  onMouseDownPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
  /** If piece is placed on board this is the index of the cells the piece is placed in see @PreviewPiece["cells"]. Will undefined if piece is not placed on board */
  placedInCells?: PreviewPiece["cells"];
  /** If piece is dropped on board but not placed. This is used to give a visual indicator, since it could appear placed if perfectly aligned with the grid */
  droppedOnBoard: boolean;
};

/** Represent where an active piece will be dropped on the board */
export type PreviewPiece = {
  /** The index of the board cell on the x axis that the active piece will be placed on  */
  x: number;
  /** The index of the board cell on the y axis that the active piece will be placed on  */
  y: number;
  /** An array of the index of the cells on the board that the active piece will be placed on, eg a cross shaped piece dropped in the top left would be
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
  grid: [number][];
  complete: boolean
};
