import { Subscribe } from "@react-rxjs/core";
import { useEffect } from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Compose } from "./Compose";
import { Design } from "./Design";
import { defaultSymbolId } from "./symbol/model";
import { changeSymbol, clipboard$, symbolState$ } from "./symbol/state";
import { merge } from "rxjs";
import { ROUTES, DEFAULT_ROUTE } from "./routes-model";

const source$ = merge(symbolState$, clipboard$);

export const Routes = () => {
  useEffect(() => {
    changeSymbol(defaultSymbolId);
  }, []);

  return (
    <Subscribe source$={source$}>
      <RouterRoutes>
        <Route path={ROUTES.DESIGN} element={<Design />} />
        <Route path={ROUTES.COMPOSE} element={<Compose />} />
        <Route path="/" element={<Navigate to={DEFAULT_ROUTE} replace />} />
        <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
      </RouterRoutes>
    </Subscribe>
  );
};
