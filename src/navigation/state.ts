import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { startWith } from "rxjs";

export type Section = "design" | "compose";
const defaultSection: Section = "design";

export const [section$, changeSection] = createSignal<Section>();

export const [useSelectedSection] = bind(
  section$.pipe(startWith(defaultSection))
);
