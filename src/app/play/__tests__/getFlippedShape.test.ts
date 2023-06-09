import { test, expect, describe } from "vitest";
import { getFlippedShape } from "../utils";

describe("getFlippedShape", () => {
  test("pieceIsFlippedX", () => {
    const pieceShape = [
      [1, 0, 0, 0],
      [1, 1, 1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, true, false);
    expect(flippedShape).toEqual([
      [1, 1, 1, 1],
      [1, 0, 0, 0],
    ]);
  });
  test("pieceIsFlippedX", () => {
    const pieceShape = [
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, true, false);
    expect(flippedShape).toEqual([
      [1, 1],
      [1, 0],
      [1, 0],
      [1, 0],
    ]);
  });
  test("pieceIsFlippedY", () => {
    const pieceShape = [
      [1, 0, 0, 0],
      [1, 1, 1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, false, true);
    expect(flippedShape).toEqual([
      [0, 0, 0, 1],
      [1, 1, 1, 1],
    ]);
  });
  test("pieceIsFlippedY", () => {
    const pieceShape = [
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, false, true);
    expect(flippedShape).toEqual([
      [0, 1],
      [0, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  test("pieceIsFlippedXY", () => {
    const pieceShape = [
      [1, 0, 0, 0],
      [1, 1, 1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, true, true);
    expect(flippedShape).toEqual([
      [1, 1, 1, 1],
      [0, 0, 0, 1],
    ]);
  });
  test("pieceIsFlippedXY", () => {
    const pieceShape = [
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, true, true);
    expect(flippedShape).toEqual([
      [1, 1],
      [0, 1],
      [0, 1],
      [0, 1],
    ]);
  });
  test("not flipped", () => {
    const pieceShape = [
      [1, 0, 0, 0],
      [1, 1, 1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, false, false);
    expect(flippedShape).toEqual([
      [1, 0, 0, 0],
      [1, 1, 1, 1],
    ]);
  });
  test("not flipped", () => {
    const pieceShape = [
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ];

    const flippedShape = getFlippedShape(pieceShape, false, false);
    expect(flippedShape).toEqual([
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ]);
  });
});
