import { ReactNode } from "react";
import "./AppLayout.css";

type AppLayoutProps = {
  header?: ReactNode;
  body?: ReactNode;
};

export const AppLayout = (props: AppLayoutProps) => (
  <div className="app-layout">
    <div className="app-layout-header">{props.header}</div>
    <div className="app-layout-body">{props.body}</div>
  </div>
);
