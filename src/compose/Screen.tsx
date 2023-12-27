import clsx from "clsx";
import { CenterLayout } from "../layout/CenterLayout";
import { GridLayout } from "../layout/GridLayout";
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
  const playhead = usePlayhead();
  return (
    <CenterLayout className="screen">
      <div>
        <GridLayout rows={screenRows} cols={screenCols} gap={1}>
          {screenVector.map((pixelId) => (
            <Pixel key={pixelId} pixelId={pixelId} />
          ))}
        </GridLayout>
        <p className="debug-view">
          screen size: {screenSize}, buffer size: {bufferSize}, screen cols:{" "}
          {screenCols}, screen rows: {screenRows}, playhead: {playhead}
        </p>
      </div>
    </CenterLayout>
  );
};

const Pixel = (props: { pixelId: number }) => {
  const on = useScreenPixelValue(props.pixelId);
  return (
    <div
      className={clsx("screen-pixel", {
        on,
      })}
    ></div>
  );
};
