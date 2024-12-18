import { Subscribe } from "@react-rxjs/core";
import { Button } from "../components";
import { DebugButton } from "../debug/DebugButton";
import { Section, changeSection, useSelectedSection } from "./state";

export const Navigation = () => (
  <Subscribe>
    <DebugButton />
    <NavigationButton section="compose" />
    <NavigationButton section="design" />
  </Subscribe>
);

const NavigationButton = (props: { section: Section }) => (
  <Button
    primary={useSelectedSection() === props.section}
    onClick={() => changeSection(props.section)}
  >
    {props.section}
  </Button>
);
