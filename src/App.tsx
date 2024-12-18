import "./App.css";
import { Routes } from "./Routes";
import { AppLayout } from "./layout/AppLayout";
import { Navigation } from "./navigation/Navigation";

function App() {
  return <AppLayout header={<Navigation />} body={<Routes />} />;
}

export default App;
