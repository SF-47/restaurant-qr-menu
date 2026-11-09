import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import PublicMenuPage from "./pages/PublicMenuPage";

// Lazy-loaded so customers never download the admin UI or Firebase Auth.
const AdminMenuPage = lazy(() => import("./pages/AdminMenuPage"));
const AdminDemoPage = lazy(() => import("./pages/AdminDemoPage"));

// Keep in sync with the rewrites in firebase.json.
const ADMIN_PATH = "/6975fc7b-e74c-8330-b6f1-8fe2f9b3d526";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicMenuPage />} />
        <Route
          path={ADMIN_PATH}
          element={
            <Suspense fallback={null}>
              <AdminMenuPage />
            </Suspense>
          }
        />
        <Route
          path="/admin-demo"
          element={
            <Suspense fallback={null}>
              <AdminDemoPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
