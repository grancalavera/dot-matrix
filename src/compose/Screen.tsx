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
import { usePlayhead, useScreenPixelValue } from "./state";

export const Screen = () => {
  return (
    <CenterLayout className="screen">
      <div>
        <GridLayout rows={screenRows} cols={screenCols} gap={1}>
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
  const playhead = usePlayhead();
  return (
    <p className="debug-view">
      screen size: {screenSize}, buffer size: {bufferSize / symbolSize}, screen
      cols: {screenCols}, screen rows: {screenRows}, playhead: {playhead}
    </p>
  );
};

const Pixel = (props: { pixelId: number }) => {
  const on = useScreenPixelValue(props.pixelId);
  return <div className={clsx("screen-pixel", { on })}></div>;
};
