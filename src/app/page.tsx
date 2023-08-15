"use client";
import Logo from "./play/assets/logo-final-1-min.svg";
import { AnimatedBackground } from "./play/level/components/AnimatedBackground";
import gameAreaStyles from "./play/level/styles/gameArea.module.css";
import * as twStyles from "./play/level/styles/styles";
import { PieceData, pieces, row } from "./pieces";
import { memo, useEffect, useMemo, useState } from "react";
import { Animate } from "react-simple-animate";
import { PieceDiv } from "./play/level/components/PieceDiv";
import { useResizeDetector } from "react-resize-detector";
import homeStyles from "./home.module.css";
import { faForwardStep, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import classnames from "classnames";
import { sigmarOne } from "./fonts";


export default function Home() {

  return (
    <div className={classnames(gameAreaStyles.gameArea)}>
      <AnimatedBackground />
      <div
        className={homeStyles.homeStack}
        style={{ height: `calc(100% - 240px)` }}
      >
        <div className={homeStyles.logoWrapper}>
          <Logo height={240} style={{ maxWidth: "90%" }} />
        </div>
        <PlayButton />
      </div>
      <FallingPieces />
      <Pieces />
    </div>
  );
}

const PlayButton = () => {
  return (
    <div className={homeStyles.startButtonWrapper}>
      <div className={homeStyles.startButtonBorder}>
        <Link
          href={`/play/level/1`}
          className={classnames(homeStyles.startButton, sigmarOne.className)}
        >
          <span>PLAY</span>
          <FontAwesomeIcon
            icon={faPlay}
            style={{ filter: `drop-shadow(1px 1px 0 #000)` }}
          />
        </Link>
      </div>
    </div>
  );
};

const FallingPieces = () => {
  return (
    <>
      <div id={homeStyles.fallingPiece1} className={homeStyles.fallingPiece}>
        <Piece index={1} piece={{ ...pieces[0], rotation: 0.2 }} />
      </div>
      <div id={homeStyles.fallingPiece2} className={homeStyles.fallingPiece}>
        <Piece index={1} piece={{ ...pieces[1], rotation: 0.6 }} />
      </div>
      <div id={homeStyles.fallingPiece3} className={homeStyles.fallingPiece}>
        <Piece index={1} piece={{ ...pieces[5], rotation: 0.6 }} />
      </div>

      <div id={homeStyles.fallingPiece4} className={homeStyles.fallingPiece}>
        <Piece index={1} piece={{ ...pieces[4], rotation: 0.4 }} />
      </div>
      <div id={homeStyles.fallingPiece5} className={homeStyles.fallingPiece}>
        <Piece index={1} piece={{ ...pieces[3], rotation: 0.5 }} />
      </div>
      <div id={homeStyles.fallingPiece6} className={homeStyles.fallingPiece}>
        <Piece index={1} piece={{ ...pieces[6], rotation: 0.3 }} />
      </div>
    </>
  );
};

const Pieces = memo(function Pieces() {
  const { width: resizeWidth, ref } = useResizeDetector();
  const width = resizeWidth || 0;
  const scale = getScale(width);

  return (
    <div
      ref={ref}
      className={homeStyles.piecesWrappper}
      style={{
        transform: `scale(${scale})`,
        bottom: getBottom(width),
      }}
    >
      <Row1 width={width} />
      <Row2 width={width} />
      <Row3 width={width} />
    </div>
  );
});

const Row1 = ({ width }: { width: number }) => {
  const pieceCount = getPieceCount(width);
  return (
    <div
      id="row1"
      style={{
        zIndex: 5,
        position: "relative",
      }}
    >
      {row.slice(0, pieceCount).map(({ id, position, rotation }, index) => {
        const piece = pieces.find((piece) => piece.id === id);
        return piece ? (
          <Piece
            index={index}
            piece={{ ...piece, rotation, position }}
            key={index}
          />
        ) : null;
      })}
    </div>
  );
};

const Row2 = ({ width }: { width: number }) => {
  const pieceCount = getPieceCount(width);
  return (
    <div
      id="row2"
      style={{
        transform: "translateY(-20px) scale(0.8)",
        zIndex: 4,
        position: "relative",
      }}
    >
      {row.slice(0, pieceCount).map(({ id, position, rotation }, index) => {
        const piece = pieces.find((piece) => piece.id === id);
        return piece ? (
          <Piece
            index={index}
            piece={{
              ...piece,
              rotation: Math.random() * 0.05 * (Math.random() > 0.5 ? 1 : -1),
              position,
              color: shadeHexColor(piece.color, -0.1),
            }}
            key={index}
          />
        ) : null;
      })}
    </div>
  );
};

const Row3 = ({ width }: { width: number }) => {
  const pieceCount = getPieceCount(width);
  return (
    <div
      id="row2"
      style={{
        transform: "translateY(-40px) scale(0.6)",
        zIndex: 3,
        position: "relative",
      }}
    >
      {row.slice(0, pieceCount).map(({ id, position, rotation }, index) => {
        const piece = pieces.find((piece) => piece.id === id);
        return piece ? (
          <Piece
            index={index}
            piece={{
              ...piece,
              rotation,
              position,
              color: shadeHexColor(piece.color, -0.2),
            }}
            key={index}
          />
        ) : null;
      })}
    </div>
  );
};

type PreplacedPieceProps = {
  piece: PieceData;
  index: number;
};

const Piece = ({ piece, index }: PreplacedPieceProps) => {
  const { id, position, color, height, width, currentShape, rotation } = piece;

  const x = position.x;
  const y = position.y;

  const style = useMemo(
    () => ({
      transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}turn)`,
      transition: "transform 0.2s ease-out",
    }),
    [rotation, x, y]
  );

  return (
    <div
      style={{
        position: "absolute",
        ...style,
      }}
    >
      {/* <Animate
        key={piece.id}
        play
        duration={0.25}
        delay={index * 0.03}
        start={{
          transform: "translateY(-20px)  scale(0)",
          opacity: 0.5,
        }}
        end={{
          transform: "translateX(0px) scale(1)",
          opacity: 1,
        }}
        easeType="ease-out"
      > */}
      <PieceDiv
        hasBoxShadow={false}
        hasOutline={false}
        opacity={1}
        id={id.toString()}
        color={color}
        width={width}
        height={height}
        shape={currentShape}
        rotation={rotation}
        isFlippedX={false}
        isFlippedY={false}
      />
      {/* </Animate> */}
    </div>
  );
};

const getPieceCount = (width: number) => {
  switch (true) {
    case width <= 300:
      return 9;
    case width <= 400:
      return 12;
    case width <= 500:
      return 13;
    case width <= 600:
      return 16;
    case width <= 800:
      return 16;
    case width <= 1000:
      return 28;
    case width <= 1500:
      return 55;
    case width <= 2000:
      return 55;
    case width <= 2500:
      return 55;
    default:
      return 65;
  }
};

const getScale = (width: number) => {
  switch (true) {
    case width <= 300:
      return 0.9;
    case width <= 400:
      return 1;
    case width <= 500:
      return 1.1;
    case width <= 600:
      return 1.2;
    case width <= 800:
      return 1.4;
    default:
      return 1.5;
  }
};

const getBottom = (width: number) => {
  switch (true) {
    case width <= 300:
      return 90;
    case width <= 400:
      return 100;
    case width <= 500:
      return 105;
    case width <= 600:
      return 115;
    case width <= 800:
      return 130;
    default:
      return 140;
  }
};

function shadeHexColor(color: string, percent: number) {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
