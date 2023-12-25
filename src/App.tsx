import { Subscribe } from "@react-rxjs/core";
import clsx from "clsx";
import { PropsWithChildren, ReactNode, useState } from "react";
import "./App.css";
import { disableDebug, enableDebug, useIsDebugEnabled } from "./debug/state";
import { GridLayout } from "./layout/GridLayout";
import { Miniature } from "./symbol/Miniature";
import { symbols } from "./symbol/model";
import {
  clearSymbolDraft,
  toggleSymbolPixel,
  useIsPixelOn,
  useSaveSymbolMutation,
  useSymbolDraft,
} from "./symbol/state";

const rows = 9;
const cols = 7;
const pixelCells = Array.from({ length: rows * cols }, (_, i) => i);

const MiniatureGrid = () => (
  <GridLayout rows={6} cols={6} gap={{ rowGap: 10, columnGap: 4 }}>
    {symbols.map((symbol) => (
      <Miniature key={symbol} symbol={symbol} />
    ))}
  </GridLayout>
);

function App() {
  return (
    <Subscribe>
      <AppLayout
        header={<Menu />}
        body={<SymbolEditor />}
        footer={<SymbolEditorToolbar />}
      />
    </Subscribe>
  );
}

const SymbolEditor = () => (
  <div className="symbol-editor">
    <CenterLayout>
      <MiniatureGrid />
    </CenterLayout>
    <CenterLayout>
      <Symbol />
    </CenterLayout>
  </div>
);

const SymbolEditorToolbar = () => {
  return (
    <Toolbar>
      <Button onClick={() => clearSymbolDraft()}>⨯</Button>
      <SaveSymbolButton />
    </Toolbar>
  );
};

const SaveSymbolButton = () => {
  const { mutate } = useSaveSymbolMutation();
  const draft = useSymbolDraft();
  return (
    <Button onClick={() => mutate(draft)} primary>
      ↵
    </Button>
  );
};

const DebugButton = () => {
  const debug = useIsDebugEnabled();
  return (
    <Button
      onClick={() => (debug ? disableDebug() : enableDebug())}
      primary={debug}
    >
      🐞
    </Button>
  );
};

const Menu = () => {
  const [selected, setSelected] = useState<"?" | "!">("?");
  return (
    <>
      <DebugButton />
      <Button primary={selected === "?"} onClick={() => setSelected("?")}>
        design
      </Button>
      <Button primary={selected === "!"} onClick={() => setSelected("!")}>
        compose
      </Button>
    </>
  );
};

type ButtonProps = {
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({
  primary,
  children,
  onClick,
  disabled,
}: PropsWithChildren<ButtonProps>) => (
  <button
    onClick={() => {
      if (disabled) return;
      onClick?.();
    }}
    className={clsx({ primary, disabled })}
  >
    {children}
  </button>
);

type _AL = {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
};

const AppLayout = (props: _AL) => (
  <div className="app-layout">
    <div className="app-layout-header">{props.header}</div>
    <div className="app-layout-body">{props.body}</div>
    <div className="app-layout-footer">{props.footer}</div>
  </div>
);

const CenterLayout = (props: PropsWithChildren) => (
  <div className="center-layout">{props.children}</div>
);

const Toolbar = (props: PropsWithChildren) => (
  <div className="toolbar">{props.children}</div>
);

const Symbol = () => (
  <GridLayout rows={rows} cols={cols}>
    {pixelCells.map((i) => (
      <PixelEditor key={i} id={i} />
    ))}
  </GridLayout>
);

const PixelEditor = (props: { id: number }) => {
  const on = useIsPixelOn(props.id);
  const debug = useIsDebugEnabled();
  return (
    <div
      className={on ? "pixel-editor on" : "pixel-editor"}
      onClick={() => toggleSymbolPixel(props.id)}
    >
      {debug && <pre className="debug">{props.id}</pre>}
    </div>
  );
};

export default App;
function useIsSymbolDraft() {
  throw new Error("Function not implemented.");
}
