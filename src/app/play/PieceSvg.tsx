import { MouseEventHandler, SVGProps } from "react";

export const PieceSvg = ({
  onClickPath,
  isPlaceable,
  id,
  height,
  width,
  color,
  d,
  ...props
}: SVGProps<SVGSVGElement> & {
  onClickPath?: MouseEventHandler<SVGPathElement> | undefined;
  isPlaceable?: boolean;
  id: string;
  color: string;
  d: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    {...props}
  >
    <path
      d={d}
      style={{
        fill: color,
      }}
      id={`piece-${id}`}
      onMouseUp={onClickPath}
    />
  </svg>
);
