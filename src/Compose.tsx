import { Subscribe } from "@react-rxjs/core";
import { ComposerToolbar } from "./compose/ComposeToolbar";
import { Screen } from "./compose/Screen";
import { ScreenBuffer } from "./compose/ScreenBuffer";
import { Fallback } from "./layout/Fallback";
import { SectionLayout } from "./layout/SectionLayout";

export const Compose = () => (
  <Subscribe fallback={<Fallback message="compose" />}>
    <SectionLayout
      body={<SectionLayout body={<Screen />} footer={<ScreenBuffer />} />}
      footer={<ComposerToolbar />}
    />
  </Subscribe>
);
