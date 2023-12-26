import { SectionLayout } from "../layout/SectionLayout";
import { ComposerToolbar } from "../compose/ComposeToolbar";
import { messageMaxLength } from "../compose/model";
import { GridLayout } from "../layout/GridLayout";

// an array with the numbers betweeen 0 and 86
export const buffer = Array.from({ length: messageMaxLength }, (_, i) => i);

export const Compose = () => (
  <SectionLayout
    body={
      <SectionLayout
        body={"screen"}
        footer={
          <GridLayout cols={messageMaxLength / 4} rows={4}>
            {buffer.map((i) => (
              <p key={i}>{i}</p>
            ))}
          </GridLayout>
        }
      />
    }
    footer={<ComposerToolbar />}
  />
);
