import {
  backgroundOpacity,
  borderRadius,
  translate,
} from "tailwindcss-classnames";
import {
  borders,
  classnames as twClassnames,
  flexBox,
  grid,
  layout,
  spacing,
  width,
  height,
  zIndex,
  padding,
  gap,
  maxWidth,
  margin,
  fontSize,
  position,
  textColor,
  backgroundColor,
} from "tailwindcss-classnames";
import { transform } from "typescript";

export const boardWrapper = twClassnames(
  layout("grid"),
  grid(
    "grid-cols-1",
    flexBox("items-center", "justify-items-center"),
    spacing("p-4")
  )
);

export const boardContainer = twClassnames(
  spacing("p-4"),
  borders("rounded-3xl")
);

export const boardCellWrapper = twClassnames(
  layout("absolute"),
  width("w-full"),
  height("h-full"),
  zIndex("z-10")
);

export const boardCellContainer = twClassnames(
  layout("inline-grid"),
  grid("grid-cols-11")
);

export const boardCell = twClassnames(width("w-16"), height("h-16"));

export const logoContainer = twClassnames(
  layout("flex"),
  flexBox("justify-center"),
  padding("p-8")
);

export const piecesContainer = twClassnames(
  layout("flex"),
  flexBox(
    "flex-wrap",
    "items-center",
    "justify-center",
  ),
  gap("gap-4"),
  padding("p-4"),
);

export const levelCompleteWrapper = twClassnames(
  layout("absolute", "top-0", "left-0"),
  width("w-full"),
  height("h-full"),
  backgroundColor("bg-black"),
  backgroundOpacity("bg-opacity-20")
);

export const levelCompleteContainer = twClassnames(
  layout("flex"),
  flexBox("items-center", "justify-center"),
  width("w-full"),
  height("h-full"),
  padding("p-4")
);

export const levelCompleteBadge = twClassnames(
  layout("flex"),
  flexBox("flex-col", "items-center"),
  // @ts-ignore
  borderRadius("rounded-t-2xl", "rounded-b-[64px]"),
  padding("px-12", "py-4")
);

export const levelCompleteStars = twClassnames(
  layout("flex"),
  flexBox("justify-center"),
  gap("gap-2"),
  height("h-24")
);

export const levelCompleteMiddleStar = twClassnames(translate("translate-y-6"));

export const levelCompleteText = twClassnames(
  fontSize("text-4xl"),
  padding("py-6")
);

export const levelCompleteIcons = twClassnames(
  layout("flex"),
  flexBox("justify-center"),
  gap("gap-4")
);

export const levelCompleteIconWrapper = twClassnames(
  borderRadius("rounded-full")
);
export const levelCompleteIcon = twClassnames(
  layout("flex"),
  flexBox("justify-center", "items-center"),
  fontSize("text-4xl"),
  borderRadius("rounded-full"),
  width("w-20"),
  height("h-20")
);
