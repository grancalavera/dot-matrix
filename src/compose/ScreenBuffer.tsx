import clsx from "clsx";
import { CenterLayout } from "../layout/CenterLayout";
import { GridLayout } from "../layout/GridLayout";
import { symbolCols, symbolRows, symbolVector } from "../symbol/model";
import { useSymbolPixelValue } from "../symbol/state";
import "./ScreenBuffer.css";
import { buffer, messageMaxLength } from "./model";
import { useScreenBufferSymbol } from "./state";

const quickEdit = (symbol: string) => {
  const url = "/quick-edit/?s=" + encodeURIComponent(symbol);
  const width = 450;
  const height = 540;
  window.open(url, "quick-edit", `width=${width},height=${height}`);
};

export const ScreenBuffer = () => (
  <div className="screen-buffer">
    <GridLayout
      cols={messageMaxLength / 4}
      rows={4}
      gap={{ columnGap: 0, rowGap: 5 }}
    >
      {buffer.map((i) => (
        <BufferThumbnail index={i} key={i} />
      ))}
    </GridLayout>
  </div>
);

const BufferThumbnail = (props: { index: number }) => {
  const symbol = useScreenBufferSymbol(props.index);
  return (
    <CenterLayout
      onClick={() => {
        if (symbol === undefined) return;
        quickEdit(symbol);
      }}
      className={clsx("screen-buffer-thumbnail", {
        active: symbol !== undefined,
      })}
    >
      <GridLayout rows={symbolRows} cols={symbolCols} gap={1}>
        {symbolVector.map((pixelId) => (
          <Pixel key={pixelId} pixelId={pixelId} symbol={symbol ?? " "} />
        ))}
      </GridLayout>
      <pre className="debug-view">{props.index}</pre>
    </CenterLayout>
  );
};

const Pixel = (props: { symbol: string; pixelId: number }) => (
  <div
    className={clsx("screen-buffer-thumbnail-pixel", {
      on: useSymbolPixelValue(props.symbol, props.pixelId),
    })}
  ></div>
);
