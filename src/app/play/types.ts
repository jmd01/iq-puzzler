export type Rotation = 0 | 0.25 | 0.5 | 0.75;
export type Piece = {
  id: string;
  isOverBoard: boolean;
  initialPosition: { x: number; y: number };
  position: { x: number; y: number };
  rotation: Rotation;
  shape: number[][];
  size: [number, number];
  isActivePiece: boolean;
  onMouseDownPosition?: { x: number; y: number };
  dragPosition?: { x: number; y: number };
};

export type PreviewPiece = { x: number; y: number; cells: [number, number][] };
