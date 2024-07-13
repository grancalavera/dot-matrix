import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./SymbolEditor.css";
import {
  symbolIndexToRowMajor,
  symbolCols,
  symbolRows,
  symbolVector,
} from "./model";
import { toggleSymbolPixel, useIsSymbolDraftPixelOn } from "./state";

export const SymbolEditor = () => (
  <GridLayout rows={symbolRows} cols={symbolCols}>
    {symbolVector.map((pixelId) => (
      <SymbolEditorPixel key={pixelId} pixelId={pixelId} />
    ))}
  </GridLayout>
);

const SymbolEditorPixel = (props: { pixelId: number }) => {
  const on = useIsSymbolDraftPixelOn(props.pixelId);
  return (
    <div
      className={clsx("symbol-editor-pixel", { on })}
      onClick={() => toggleSymbolPixel(props.pixelId)}
    >
      <pre className="debug-view">
        {props.pixelId}_{symbolIndexToRowMajor(props.pixelId)}
      </pre>
    </div>
  );
};
