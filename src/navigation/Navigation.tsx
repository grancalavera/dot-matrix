import { Subscribe } from "@react-rxjs/core";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { DebugButton } from "../debug/DebugButton";
import { getSectionFromRoute, getRouteFromSection, isValidRoute } from "../routes-model";
import { Section } from "./state";

export const Navigation = () => (
  <Subscribe>
    <DebugButton />
    <NavigationButton section="compose" />
    <NavigationButton section="design" />
  </Subscribe>
);

const NavigationButton = (props: { section: Section }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentSection = isValidRoute(location.pathname) 
    ? getSectionFromRoute(location.pathname)
    : "design";
  
  const isActive = currentSection === props.section;
  
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
