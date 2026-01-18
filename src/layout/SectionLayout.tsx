import { ReactNode } from "react";
import "./SectionLayout.css";

type SectionLayoutProps = {
  body?: ReactNode;
  footer?: ReactNode;
};

export const SectionLayout = (props: SectionLayoutProps) => (
  <div className="section-layout">
    <div className="section-layout-body">{props.body}</div>
    <div className="section-layout-footer">{props.footer}</div>
  </div>
);
