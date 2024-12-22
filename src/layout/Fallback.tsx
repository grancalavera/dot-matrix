import { CenterLayout } from "./CenterLayout";

type FallbackProps = {
  message?: string;
};

export const Fallback = (props: FallbackProps) => (
  <CenterLayout>
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 20 }}>⏳</p>
      {props.message && (
        <pre style={{ fontSize: 14, color: "gray" }}>{props.message}</pre>
      )}
    </div>
  </CenterLayout>
);
