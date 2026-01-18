import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./Routes";
import { AppLayout } from "./layout/AppLayout";
import { Navigation } from "./navigation/Navigation";

function App() {
  return (
    <BrowserRouter>
      <AppLayout header={<Navigation />} body={<Routes />} />
    </BrowserRouter>
  );
}

export default App;
