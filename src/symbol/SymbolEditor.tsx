import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./SymbolEditor.css";
import { symbolCols, symbolRows, symbolVector } from "./model";
import { toggleSymbolPixel, useIsSymbolDraftPixelOn } from "./state";

export const SymbolEditor = () => (
  <GridLayout rows={symbolRows} cols={symbolCols}>
    {symbolVector.map((i) => (
      <SymbolEditorPixel key={i} id={i} />
    ))}
  </GridLayout>
);

const SymbolEditorPixel = (props: { id: number }) => {
  const on = useIsSymbolDraftPixelOn(props.id);
  return (
    <div
      className={clsx("symbol-editor-pixel", { on })}
      onClick={() => toggleSymbolPixel(props.id)}
    >
      <pre className="debug-view">{props.id}</pre>
    </div>
  );
};
