import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { startWith } from "rxjs";

export { changeSection, useSelectedSection };

export type Section = "design" | "compose";
const [section$, changeSection] = createSignal<Section>();

const [useSelectedSection] = bind(
  section$.pipe(startWith("design" as Section))
);
