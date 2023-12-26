type SectionLayoutProps = {
  body?: ReactNode;
  footer?: ReactNode;
};
import "./SectionLayout.css";

export const SectionLayout = (props: SectionLayoutProps) => (
  <div className="section-layout">
    <div className="section-layout-body">{props.body}</div>
    <div className="section-layout-footer">{props.footer}</div>
  </div>
);
