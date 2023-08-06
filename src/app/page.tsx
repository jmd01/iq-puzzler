"use client";
import Logo2 from "./play/assets/iq-puzzler-logo-splash-2-min.svg";
import { AnimatedBackground } from "./play/level/components/AnimatedBackground";
import gameAreaStyles from "./play/level/styles/gameArea.module.css";
import * as twStyles from "./play/level/styles/styles";
import { PieceData, pieces, row } from "./pieces";
import { useMemo } from "react";
import { Animate } from "react-simple-animate";
import { PieceDiv } from "./play/level/components/PieceDiv";
import { useResizeDetector } from "react-resize-detector";
import homeStyles from "./home.module.css";

export default function Home() {
  return (
    <div
      className={gameAreaStyles.gameArea}
      style={{ width: "100%", height: "100%" }}
    >
      <AnimatedBackground />
      {/* <div className={twStyles.logoContainer}>
        <Logo width={200} />
      </div>
      <div className={twStyles.logoContainer}>
        <Logo1 width={200} />
      </div> */}
      <div className={twStyles.logoContainer}>
        <span className={homeStyles.logo}>
          <Logo2 width={200} />
        </span>
      </div>

      <Pieces />
    </div>
  );
}

const Pieces = () => {
  const { width: resizeWidth, ref } = useResizeDetector();
  const width = resizeWidth || 0;
  const scale = getScale(width);

  // const xSpacing = 40;
  // const offset = 0 * scale;
  // const halfWidth = window.innerWidth / 2;
  // const piecesCount = Math.ceil(window.innerWidth / 60);
  // console.log(piecesCount);

  // const rows = useMemo(() => {
  //   return [...Array(3)].map((_, i) => {
  //     let piecesRow = [];
  //     for (let j = 0; j < 1; j++) {
  //       const pieceIndex = i % 2 === 0 ? j % 12 : 11 - (j % 12);

  //       const pieceLeft: Piece = {
  //         ...pieces[pieceIndex],
  //         position: {
  //           x:
  //             (halfWidth - j * xSpacing - pieces[pieceIndex].width - offset) /
  //             (scale - i * 0.2),
  //           y: i * -50,
  //         },
  //         rotation: Math.random() * 360,
  //       };
  //       const pieceRight: Piece = {
  //         ...pieces[pieceIndex],
  //         position: {
  //           x: (halfWidth + (j * xSpacing - offset)) / scale,
  //           y: i * -50,
  //         },
  //         rotation: Math.random() * 360,
  //       };

  //       console.log(
  //         i,
  //         j,
  //         halfWidth,
  //         j * xSpacing,
  //         halfWidth + (j * xSpacing - offset)
  //       );

  //       piecesRow.push(
  //         <PreplacedPiece piece={pieceLeft} index={j} key={`${i}-${j}-left`} />,
  //         <PreplacedPiece
  //           piece={pieceRight}
  //           index={j}
  //           key={`${i}-${j}-right`}
  //         />
  //       );
  //     }
  //     return (
  //       <div
  //         id={`row-${i}`}
  //         style={{
  //           position: "absolute",
  //           zIndex: 5 - i,
  //           transform: `scale(${1 - i * 0.15})`,
  //         }}
  //         key={i}
  //       >
  //         {piecesRow}
  //       </div>
  //     );
  //   });
  // }, [halfWidth, offset, xSpacing]);
  console.log({ resizeWidth, width });

  return (
    <div
      ref={ref}
      style={{
        transform: `scale(${scale})`,
        bottom: getBottom(width),
        position: "absolute",
        width: "100%",
      }}
    >
      <Row1 width={width} />
      <Row2 width={width} />
      <Row3 width={width} />
    </div>
  );
};

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
      return 18;
    case width <= 1500:
      return 28;
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
