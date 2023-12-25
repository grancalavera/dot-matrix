import clsx from "clsx";
import { GridLayout } from "../layout/GridLayout";
import "./Minitature.css";
import { editSymbol, useIsSymbolSelected } from "./state";

const rows = 9;
const cols = 7;
const pixelCells = Array.from({ length: rows * cols }, (_, i) => i);

type SymbolMiniatureProps = {
  symbol: string;
};

export const Miniature = (props: SymbolMiniatureProps) => {
  const miniatureSelected = useIsSymbolSelected(props.symbol);

  return (
    <div
      onClick={() => {
        console.log("editSymbol", props.symbol);
        editSymbol(props.symbol);
      }}
      className={clsx("miniature", { miniatureSelected })}
    >
      <p>{props.symbol}</p>
      <GridLayout rows={rows} cols={cols} gap={1}>
        {pixelCells.map((i) => (
          <MiniaturePixel key={i} />
        ))}
      </GridLayout>
    </div>
  );
};

const MiniaturePixel = () => <div className="miniaturePixel"></div>;
