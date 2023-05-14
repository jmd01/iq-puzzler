import Image from "next/image";
import SpheresSvg from "./assets/spheres.svg";
import SpheresCrossSvg from "./assets/spheres-cross.svg";
import SpheresCrossSimpleSvg from "./assets/spheres-cross-simple.svg";
import SpheresCrossUnitedSvgr from "./assets/spheres-cross-united.svg";
import { SpheresCrossUnitedSvg } from "./SpheresCrossUnitedSvg";

export default function Page() {
  return (
    <>
      <Board />
      {/* <Pieces /> */}
    </>
  );
}

const Board = () => {
  return (
    <div className="grid grid-cols-1 items-center justify-items-center p-4">
      <div className="p-4 rounded-3xl bg-gradient-to-b from-slate-500 to-slate-600">
        <div
          className="inline-grid grid-cols-12 gap-2 "
          style={{ position: "relative" }}
        >
          <>
            <PieceSvg1 />
            {[...Array(72)].map((_, i) => (
              <span
                key={i}
                className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-400"
              />
            ))}
          </>
        </div>
      </div>
    </div>
  );
};

const Pieces = () => {
  return (
    <div className="grid grid-cols-1 items-center justify-items-center p-4">
      <Piece2 />
    </div>
  );
};

const PieceSvg1 = () => {
  return (
    <div
      className="piece"
      style={{
        position: "absolute",
        top: "0rem",
        left: "0rem",
        width: "13rem",
        // display: "flex",
        // alignItems: "center",
        // flexDirection: "column",
        transform: "translateX(2.25rem) translateY(-2.25rem) rotate(90deg)", // ratio of total spheres height / width + num connectors
      }}
    >
      {/* <Image priority src={SpheresCrossSvg} alt=" " /> */}
      {/* <SpheresCrossSvg /> */}
      {/* <SpheresCrossSimpleSvg /> */}
      {/* <SpheresCrossUnitedSvgr /> */}
      <SpheresCrossUnitedSvg />
    </div>
  );
};

// const Piece1 = () => {
//   return (
//     <div
//       className="piece"
//       style={{
//         position: "absolute",
//         top: "0rem",
//         left: "0rem",
//         display: "flex",
//         alignItems: "center",
//         flexDirection: "column",
//         transform: "translateX(2.25rem) translateY(-2.25rem) rotate(90deg)", // ratio of total spheres height / width + num connectors
//       }}
//     >
//       <Sphere />
//       <Connector />
//       <Sphere />
//     </div>
//   );
// };

// const Piece2 = () => {
//   return (
//     <div
//       className="piece"
//       style={{
//         position: "absolute",
//         top: "9rem", // 2nd row (2x (4+0.5))
//         left: "13.5rem", // 3rd col (3x (4+0.5))
//         display: "flex",
//         alignItems: "center",
//         flexDirection: "column",
//         // transform: "translateX(2.25rem) translateY(-2.25rem) rotate(90deg)", // ratio of total spheres height / width + num connectors
//       }}
//     >
//       <Sphere />
//       <Connector />
//       <Sphere />
//       <Connector />
//       <Sphere />
//     </div>
//   );
// };

// // 4rem
// const Sphere = () => {
//   return (
//     <div
//       className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-red-800 to-red-400"
//       style={{ zIndex: 1 }} // Render above connectors
//     />
//   );
// };

// // 0.5 rem
// const Connector = () => {
//   return (
//     <div
//       className="w-6 h-6 bg-red-800"
//       style={{ margin: "-0.5rem 0", visibility: "hidden" }}
//     />
//   );
// };
