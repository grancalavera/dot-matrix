import { PropsWithChildren } from "react";
import "./CenterLayout.css";

export const CenterLayout = (props: PropsWithChildren) => (
  <div className="center-layout">{props.children}</div>
);
