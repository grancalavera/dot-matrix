import { Subscribe } from "@react-rxjs/core";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { DebugButton } from "../debug/DebugButton";
import { getRouteFromSection, useIsSectionActive } from "../routes-model";
import { Section } from "./state";

export const Navigation = () => (
  <Subscribe>
    <DebugButton />
    <NavigationButton section="compose" />
    <NavigationButton section="design" />
  </Subscribe>
);

const NavigationButton = (props: { section: Section }) => {
  const navigate = useNavigate();
  const isActive = useIsSectionActive(props.section);
  
  const handleClick = () => {
    const route = getRouteFromSection(props.section);
    navigate(route);
  };

  return (
    <Button primary={isActive} onClick={handleClick}>
      {props.section}
    </Button>
  );
};
