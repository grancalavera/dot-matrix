import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./Minitature.css";
import { editSymbol, useIsSymbolPixelOn, useIsSymbolSelected } from "./state";

const rows = 9;
const cols = 7;
const pixelCells = Array.from({ length: rows * cols }, (_, i) => i);

type MiniatureProps = {
  symbol: string;
};

export const Miniature = (props: MiniatureProps) => {
  const miniatureSelected = useIsSymbolSelected(props.symbol);

  return (
    <div
      onClick={() => editSymbol(props.symbol)}
      className={clsx("miniature", { miniatureSelected })}
    >
      <p>{props.symbol === " " ? <>&nbsp;</> : props.symbol}</p>
      <GridLayout rows={rows} cols={cols} gap={1}>
        {pixelCells.map((i) => (
          <MiniaturePixel
            key={`${props.symbol}-${i}`}
            symbol={props.symbol}
            index={i}
          />
        ))}
      </GridLayout>
    </div>
  );
};

type MiniaturePixelProps = {
  symbol: string;
  index: number;
};

const MiniaturePixel = (props: MiniaturePixelProps) => {
  const miniaturePixelOn = useIsSymbolPixelOn(props.symbol, props.index);
  return <div className={clsx("miniaturePixel", { miniaturePixelOn })}></div>;
};
