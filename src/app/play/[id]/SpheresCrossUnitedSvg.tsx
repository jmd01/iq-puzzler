import { MouseEventHandler, SVGProps } from "react";

export const SpheresCrossUnitedSvg = ({
  onClickPath,
  isPlaceable,
  id,
  ...props
}: SVGProps<SVGSVGElement> & {
  onClickPath?: MouseEventHandler<SVGPathElement> | undefined;
  isPlaceable?: boolean;
  id: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={192}
    height={256}
    viewBox="0 0 192 256"
    {...props}
  >
    <path
      d="M96 0c17.664 0 32 14.336 32 32 0 17.66-14.328 31.992-31.986 32 17.654.008 31.98 14.335 31.986 31.99.006-17.66 14.34-31.99 32-31.99 17.664 0 32 14.336 32 32s-14.336 32-32 32c-17.66 0-31.994-14.33-32-31.99-.006 17.655-14.332 31.982-31.986 31.99 17.658.008 31.986 14.34 31.986 32s-14.328 31.992-31.986 32c17.658.008 31.986 14.34 31.986 32 0 17.664-14.336 32-32 32s-32-14.336-32-32c0-17.66 14.328-31.992 31.986-32C78.328 191.992 64 177.66 64 160s14.328-31.992 31.986-32C78.333 127.992 64.008 113.667 64 96.014 63.992 113.672 49.66 128 32 128c-17.664 0-32-14.336-32-32s14.336-32 32-32c17.66 0 31.992 14.328 32 31.986C64.008 78.333 78.333 64.008 95.986 64 78.328 63.992 64 49.66 64 32 64 14.336 78.336 0 96 0z"
      style={{
        fill: "#f72f3a",
      }}
      id={`piece-${id}`}
      onMouseUp={onClickPath}
    />
  </svg>
);
