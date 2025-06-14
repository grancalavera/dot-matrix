import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./SymbolEditor.css";
import { symbolCols, symbolIndexToRowMajor, symbolVector } from "./model";
import { toggleSymbolPixel, useSymbolDraftPixelValue } from "./state";

export const SymbolEditor = () => (
  <GridLayout cols={symbolCols}>
    {symbolVector.map((pixelId) => (
      <SymbolEditorPixel key={pixelId} pixelId={pixelId} />
    ))}
  </GridLayout>
);

const SymbolEditorPixel = (props: { pixelId: number }) => {
  const on = useSymbolDraftPixelValue(props.pixelId);
  return (
    <div
      className={clsx("symbol-editor-pixel", { on })}
      onClick={() => toggleSymbolPixel(props.pixelId)}
    >
      <pre className="debug-view">
        {props.pixelId}_{symbolIndexToRowMajor(props.pixelId)}
        <br />
        {on ? 1 : 0}
      </pre>
    </div>
  );
};
