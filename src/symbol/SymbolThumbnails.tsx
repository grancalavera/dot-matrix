import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./SymbolThumbnails.css";
import { symbolCols, symbolVector, symbolRows, symbols } from "./model";
import { editSymbol, useIsSymbolPixelOn, useIsSymbolSelected } from "./state";

export const SymbolThumbnails = () => (
  <GridLayout rows={6} cols={6} gap={{ rowGap: 10, columnGap: 4 }}>
    {symbols.map((symbol) => (
      <SymbolThumbnail key={symbol} symbol={symbol} />
    ))}
  </GridLayout>
);

type SymbolThumbnailProps = {
  symbol: string;
};

const SymbolThumbnail = (props: SymbolThumbnailProps) => {
  const selected = useIsSymbolSelected(props.symbol);

  return (
    <div
      onClick={() => editSymbol(props.symbol)}
      className={clsx("symbol-thumbnail", { selected })}
    >
      <p className="symbol-thumbnail-label">
        {props.symbol === " " ? <>&nbsp;</> : props.symbol}
      </p>
      <GridLayout rows={symbolRows} cols={symbolCols} gap={1}>
        {symbolVector.map((i) => (
          <Pixel key={`${props.symbol}-${i}`} symbol={props.symbol} index={i} />
        ))}
      </GridLayout>
    </div>
  );
};

type PixelProps = SymbolThumbnailProps & {
  index: number;
};

const Pixel = (props: PixelProps) => {
  const on = useIsSymbolPixelOn(props.symbol, props.index);
  return <div className={clsx("symbol-thumbnail-pixel", { on })}></div>;
};
