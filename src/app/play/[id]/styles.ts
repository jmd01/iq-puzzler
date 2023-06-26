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
} from "tailwindcss-classnames";

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
  flexBox("flex-wrap", "items-center", "justify-between"),
  gap("gap-4"),
  maxWidth("max-w-4xl"),
  padding("p-4"),
  margin("mx-auto")
);
