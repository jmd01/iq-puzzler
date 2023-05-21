import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { MouseEventHandler, SVGProps } from "react";

export const SpheresCrossUnitedSvg = ({
  onClickPath,
  isPlaceable,
  setNodeRef,
  listeners,
  attributes,
  ...props
}: SVGProps<SVGSVGElement> & {
  onClickPath?: MouseEventHandler<SVGPathElement> | undefined;
  isPlaceable?: boolean;
  setNodeRef: (element: SVGSVGElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes

}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={208}
    height={280}
    viewBox="142.667 53.333 208 280"
    style={
      isPlaceable
        ? {
            position: "absolute",
            top: isPlaceable ? 10 : 0,
            left: isPlaceable ? 10 : 0,
            zIndex: isPlaceable ? 0 : 1,
          }
        : {
            position: "relative",
            zIndex: 1,
          }
    }
    // transform={isPlaceable ? "translate(10 -270)" : undefined}
  >
    <path
      d="M104 0c17.664 0 32 14.336 32 32 0 14.902-10.203 27.435-24 30.99v10.02c11.24 2.896 20.094 11.75 22.99 22.99h10.02c3.555-13.797 16.088-24 30.99-24 17.664 0 32 14.336 32 32s-14.336 32-32 32c-14.902 0-27.435-10.203-30.99-24h-10.02c-2.896 11.24-11.75 20.094-22.99 22.99v10.02c13.797 3.555 24 16.088 24 30.99 0 14.902-10.203 27.435-24 30.99v10.02c13.797 3.555 24 16.088 24 30.99 0 17.664-14.336 32-32 32s-32-14.336-32-32c0-14.902 10.203-27.435 24-30.99v-10.02c-13.797-3.555-24-16.088-24-30.99 0-14.902 10.203-27.435 24-30.99v-10.02c-11.24-2.896-20.094-11.75-22.99-22.99H62.99c-3.555 13.797-16.088 24-30.99 24-17.664 0-32-14.336-32-32s14.336-32 32-32c14.902 0 27.435 10.203 30.99 24h10.02C75.905 84.76 84.76 75.906 96 73.01V62.99C82.203 59.436 72 46.903 72 32c0-17.664 14.336-32 32-32z"
      style={{
        stroke: "#c0e607",
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt",
        strokeDashoffset: 0,
        strokeLinejoin: "miter",
        strokeMiterlimit: 4,
        fill: isPlaceable ? "#fff" : "#f72f3a",
        fillRule: "nonzero",
        opacity: isPlaceable ? 0.4 : 1,
      }}
      transform="translate(142.667 53.333)"
      vectorEffect="non-scaling-stroke"
      // onClick={onClickPath}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      {...props}
  
    />
  </svg>
);
