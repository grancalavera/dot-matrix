import { BufferThumbnail, ScreenBuffer } from "./compose/ScreenBuffer";
import { ComposerToolbar } from "./compose/ComposeToolbar";
import { messageMaxLength } from "./compose/model";
import { CenterLayout } from "./layout/CenterLayout";
import { GridLayout } from "./layout/GridLayout";
import { SectionLayout } from "./layout/SectionLayout";

export const Compose = () => (
  <SectionLayout
    body={<SectionLayout body={"screen"} footer={<ScreenBuffer />} />}
    footer={<ComposerToolbar />}
  />
);
