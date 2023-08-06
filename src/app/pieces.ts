import { Rotation } from "./play/level/types";

export type PieceData = {
  id: number;
  rotation: Rotation;
  height: number;
  width: number;
  color: string;
  position: { x: number; y: number };
  currentShape: number[][];
};

export const pieces: PieceData[] = [
  {
    id: 6,
    currentShape: [
      [1, 1, 0, 0],
      [0, 1, 1, 1],
    ],
    height: 128,
    width: 256,
    color: "#ee5fd2",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
  {
    id: 10,
    currentShape: [
      [1, 1, 0],
      [1, 1, 1],
    ],
    height: 128,
    width: 192,
    color: "#52d4c7",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
  {
    id: 12,
    currentShape: [
      [1, 0, 1],
      [1, 1, 1],
    ],
    height: 128,
    width: 192,
    color: "#71c80e",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
  {
    id: 5,
    currentShape: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    height: 192,
    width: 128,
    color: "#b20458",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
  {
    id: 4,
    currentShape: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    height: 128,
    width: 192,
    color: "#0d1cea",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0.25,
  },
  {
    id: 8,
    currentShape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    height: 192,
    width: 192,
    color: "#ff7300",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0.25,
  },
  {
    id: 11,
    currentShape: [
      [1, 1, 1, 1],
      [0, 0, 0, 1],
    ],
    height: 128,
    width: 256,
    color: "#f72f3a",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0.5,
  },
  {
    id: 9,
    currentShape: [
      [1, 1],
      [0, 1],
    ],
    height: 128,
    width: 128,
    color: "#65ccff",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0.75,
  },
  {
    id: 2,
    currentShape: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    height: 192,
    width: 192,
    color: "#0095ff",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
  {
    id: 1,
    currentShape: [
      [1, 1, 1, 1],
      [0, 1, 0, 0],
    ],
    height: 128,
    width: 256,
    color: "#eeca11",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0.5,
  },
  {
    id: 7,
    currentShape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    height: 192,
    width: 192,
    color: "#ca1ac8",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
  {
    id: 3,
    currentShape: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    height: 192,
    width: 128,
    color: "#21a09e",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0,
  },
];

const rowData = [
  {
    id: 6,
    rotation: 0.02,
    position: { x: -100, y: 0 },
  },
  {
    id: 2,
    rotation: 0.7,
    position: { x: 0, y: 0 },
    // rotation: 0,
    // position: { x: 200, y: -200 },
  },
  {
    id: 1,
    rotation: 0.03,
    position: { x: 20, y: 0 },
  },
  {
    id: 11,
    rotation: 0.05,
    position: { x: 50, y: 25 },
  },
  {
    id: 3,
    rotation: 0.15,
    position: { x: 90, y: 0 },
  },
  {
    id: 4,
    rotation: 0.19,
    position: { x: 180, y: 10 },
  },
  {
    id: 5,
    rotation: -0.19,
    position: { x: 180, y: -20 },
  },
  {
    id: 7,
    rotation: -0.19,
    position: { x: 180, y: -20 },
  },
  {
    id: 8,
    rotation: 0.04,
    position: { x: 320, y: 0 },
  },
  {
    id: 9,
    rotation: -0.01,
    position: { x: 320, y: 0 },
  },
  {
    id: 10,
    rotation: 0.03,
    position: { x: 390, y: 0 },
  },
  {
    id: 11,
    rotation: -0.03,
    position: { x: 370, y: 0 },
  },
  {
    id: 5,
    rotation: -0.15,
    position: { x: 440, y: -20 },
  },
  {
    id: 6,
    rotation: -0.1,
    position: { x: 460, y: 0 },
  },
  {
    id: 1,
    rotation: 0.51,
    position: { x: 510, y: -20 },
  },
  {
    id: 2,
    rotation: 0.55,
    position: { x: 580, y: -5 },
  },
  {
    id: 6,
    rotation: -0.02,
    position: { x: 620, y: 0 },
  },
  {
    id: 9,
    rotation: -0.14,
    position: { x: 690, y: 0 },
  },
  {
    id: 5,
    rotation: 0.14,
    position: { x: 730, y: 0 },
  },
  {
    id: 11,
    rotation: 0.03,
    position: { x: 770, y: 0 },
  },
  {
    id: 3,
    rotation: 0.2,
    position: { x: 840, y: 0 },
  },
  {
    id: 7,
    rotation: 0.2,
    position: { x: 840, y: 0 },
  },
  {
    id: 4,
    rotation: 0.3,
    position: { x: 900, y: 40 },
  },
  {
    id: 8,
    rotation: 0.3,
    position: { x: 920, y: 0 },
  },
  {
    id: 6,
    rotation: 0.4,
    position: { x: 960, y: 0 },
  },
  {
    id: 2,
    rotation: 0.54,
    position: { x: 1010, y: 0 },
  },
  {
    id: 5,
    rotation: -0.4,
    position: { x: 1070, y: 0 },
  },
];

export const row = [
  ...rowData,
  ...rowData.reverse().map((piece) => ({
    ...piece,
    position: {
      x: piece.position.x + 1200,
      y: piece.position.y,
    },
  })),
];
