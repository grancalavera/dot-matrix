import clsx from "clsx";
import { CenterLayout } from "../layout/CenterLayout";
import { GridLayout } from "../layout/GridLayout";
import { symbolSize } from "../symbol/model";
import "./Screen.css";
import {
  bufferSize,
  screenCols,
  screenRows,
  screenSize,
  screenVector,
} from "./model";
import { usePlayHead, useScreenPixelValue } from "./state";

export const Screen = () => {
  return (
    <CenterLayout className="screen">
      <div>
        <GridLayout cols={screenCols} gap={1}>
          {screenVector.map((pixelId) => (
            <Pixel key={pixelId} pixelId={pixelId} />
          ))}
        </GridLayout>
        <DebugView />
      </div>
    </CenterLayout>
  );
};

const DebugView = () => {
  const playHead = usePlayHead();
  return (
    <p className="debug-view">
      screen size: {screenSize}, buffer size: {bufferSize / symbolSize}, screen
      cols: {screenCols}, screen rows: {screenRows}, playHead: {playHead}
    </p>
  );
};

const Pixel = (props: { pixelId: number }) => {
  const on = useScreenPixelValue(props.pixelId);
  return <div className={clsx("screen-pixel", { on })}></div>;
};
