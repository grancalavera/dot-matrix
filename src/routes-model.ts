import { useLocation } from "react-router-dom";
import { Section } from "./navigation/state";

export const ROUTES = {
  DESIGN: "/design",
  COMPOSE: "/compose",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const DEFAULT_ROUTE = ROUTES.DESIGN;

export const isValidRoute = (path: string): path is RoutePath => {
  return Object.values(ROUTES).includes(path as RoutePath);
};

export const getRouteFromSection = (section: "design" | "compose"): RoutePath => {
  return section === "design" ? ROUTES.DESIGN : ROUTES.COMPOSE;
};

export const getSectionFromRoute = (route: RoutePath): "design" | "compose" => {
  return route === ROUTES.DESIGN ? "design" : "compose";
};

export const useIsSectionActive = (section: Section): boolean => {
  const location = useLocation();
  
  const currentSection = isValidRoute(location.pathname) 
    ? getSectionFromRoute(location.pathname)
    : "design";
  
  return currentSection === section;
};