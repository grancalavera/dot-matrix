import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { startWith } from "rxjs";

export type Section = "design" | "compose";
const defaultSection: Section = "design";

const [section$, changeSection] = createSignal<Section>();
export { changeSection };

export const [useSelectedSection] = bind(
  section$.pipe(startWith(defaultSection))
);
