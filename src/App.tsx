import { Subscribe } from "@react-rxjs/core";
import "./App.css";
import { AppLayout } from "./layout/AppLayout";
import { Navigation } from "./navigation/Navigation";
import { Routes } from "./Routes";

function App() {
  return (
    <Subscribe>
      <AppLayout header={<Navigation />} body={<Routes />} />
    </Subscribe>
  );
}

export default App;
