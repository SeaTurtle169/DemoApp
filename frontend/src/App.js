import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import adminRoutes from "./routes/AdminRouter";
import userRoutes from "./routes/UserRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Gộp routes */}
        {userRoutes}
        {adminRoutes}

        {/* Public route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
