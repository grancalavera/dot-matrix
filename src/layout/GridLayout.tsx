import { PropsWithChildren } from "react";
import "./GridLayout.css";

type Gap = number | { rowGap?: number; columnGap?: number };

export const GridLayout = (
  props: PropsWithChildren<{ rows: number; cols: number; gap?: Gap }>
) => {
  let gap: number | undefined = undefined;
  let rowGap: number | undefined = undefined;
  let columnGap: number | undefined = undefined;

  if (typeof props.gap === "number") {
    gap = props.gap;
  } else if (typeof props.gap === "object") {
    rowGap = props.gap.rowGap;
    columnGap = props.gap.columnGap;
  }

  return (
    <div
      className="grid-layout"
      style={{
        gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
        gridTemplateRows: `repeat(${props.rows}, 1fr)`,
        ...{ gap, rowGap, columnGap },
      }}
    >
      {props.children}
    </div>
  );
};
