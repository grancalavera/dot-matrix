import { Subscribe } from "@react-rxjs/core";
import { Suspense } from "react";
import "./App.css";
import { Routes } from "./Routes";
import { AppLayout } from "./layout/AppLayout";
import { Navigation } from "./navigation/Navigation";

function App() {
  return (
    <Suspense>
      <Subscribe>
        <AppLayout header={<Navigation />} body={<Routes />} />
      </Subscribe>
    </Suspense>
  );
}

export default App;
