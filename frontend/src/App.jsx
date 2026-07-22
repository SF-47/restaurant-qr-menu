import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicMenuPage from "./pages/PublicMenuPage";
import AdminMenuPage from "./pages/AdminMenuPage";

const ADMIN_PATH = "/6975fc7b-e74c-8330-b6f1-8fe2f9b3d526";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicMenuPage />} />
        <Route path={ADMIN_PATH} element={<AdminMenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}
