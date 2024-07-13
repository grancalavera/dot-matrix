import clsx from "clsx";
import { HTMLProps } from "react";
import "./CenterLayout.css";

export const CenterLayout = ({
  className,
  children,
  ...props
}: HTMLProps<HTMLDivElement>) => (
  <div {...props} className={clsx("center-layout", className)}>
    {children}
  </div>
);
