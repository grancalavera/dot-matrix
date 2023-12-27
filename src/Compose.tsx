import { ComposerToolbar } from "./compose/ComposeToolbar";
import { Screen } from "./compose/Screen";
import { ScreenBuffer } from "./compose/ScreenBuffer";
import { SectionLayout } from "./layout/SectionLayout";

export const Compose = () => (
  <SectionLayout
    body={<SectionLayout body={<Screen />} footer={<ScreenBuffer />} />}
    footer={<ComposerToolbar />}
  />
);
