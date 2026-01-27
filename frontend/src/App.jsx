import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import AdminMenu from "./AdminMenu";
import "./App.css";

const ADMIN_PATH = "/6975fc7b-e74c-8330-b6f1-8fe2f9b3d526";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path={ADMIN_PATH} element={<AdminMenu />} />
      </Routes>
    </BrowserRouter>
  );
}
