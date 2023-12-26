import { PropsWithChildren } from "react";
import "./CenterLayout.css";
import clsx from "clsx";

export const CenterLayout = (
  props: PropsWithChildren<{ className?: string }>
) => (
  <div className={clsx("center-layout", props.className)}>{props.children}</div>
);
