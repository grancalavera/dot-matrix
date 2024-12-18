import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./SymbolEditorThumbnails.css";
import { symbolCols, symbolVector, symbols } from "./model";
import {
  changeSymbol,
  useIsSymbolSelected,
  useSelectedSymbolId,
  useSymbolPixelValue,
} from "./state";

export const SymbolEditorThumbnails = () => (
  <GridLayout cols={6} gap={{ rowGap: 10, columnGap: 4 }}>
    {symbols.map((symbol) => (
      <SymbolThumbnail key={symbol} symbol={symbol} />
    ))}
  </GridLayout>
);

export const SelectedSymbolThumbnail = () => {
  const symbol = useSelectedSymbolId();
  return <SymbolThumbnail symbol={symbol} />;
};

type SymbolThumbnailProps = {
  symbol: string;
};

const SymbolThumbnail = (props: SymbolThumbnailProps) => {
  const selected = useIsSymbolSelected(props.symbol);

  return (
    <div
      onClick={() => changeSymbol(props.symbol)}
      className={clsx("symbol-thumbnail", { selected })}
    >
      <p className="symbol-thumbnail-label">
        {props.symbol === " " ? <>&nbsp;</> : props.symbol}
      </p>
      <GridLayout cols={symbolCols} gap={1}>
        {symbolVector.map((pixelId) => (
          <Pixel
            key={`${props.symbol}-${pixelId}`}
            symbol={props.symbol}
            pixelId={pixelId}
          />
        ))}
      </GridLayout>
    </div>
  );
};

type PixelProps = SymbolThumbnailProps & {
  pixelId: number;
};

const Pixel = (props: PixelProps) => {
  const on = useSymbolPixelValue(props.symbol, props.pixelId);
  return <div className={clsx("symbol-thumbnail-pixel", { on })}></div>;
};
