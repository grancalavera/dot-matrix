import { Button } from "../components";
import { DebugButton } from "../debug/DebugButton";
import { Section, changeSection, useSelectedSection } from "./state";

export const Navigation = () => (
  <>
    <DebugButton />
    <NavigationButton section="design" />
    <NavigationButton section="compose" />
  </>
);

const NavigationButton = (props: { section: Section }) => (
  <Button
    primary={useSelectedSection() === props.section}
    onClick={() => changeSection(props.section)}
  >
    {props.section}
  </Button>
);
