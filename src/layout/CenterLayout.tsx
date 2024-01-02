import clsx from "clsx";
import { HTMLProps } from "react";
import "./CenterLayout.css";

export const CenterLayout = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => (
  <div {...props} className={clsx("center-layout", className)}>
    {props.children}
  </div>
);
