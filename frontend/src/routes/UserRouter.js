// routes/userRoutes.js
import { Route } from "react-router-dom";
import TestInternet from "../components/testInternet";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/DashBoard";
import Profile from "../pages/Profile";
import Settings from "../pages/Setting";
import PrivateRoute from "./PrivateRoute";

const userRoutes = (
  <>
    <Route
      path="/dashboard"
      element={
        <PrivateRoute roles={["DIRECTOR", "MANAGER", "ADMIN"]}>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute roles={["DIRECTOR", "MANAGER", "SUPERVISOR", "ADMIN"]}>
          <MainLayout>
            <Profile />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <PrivateRoute roles={["DIRECTOR", "MANAGER"]}>
          <MainLayout>
            <Settings />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/test"
      element={
        <PrivateRoute roles={["DIRECTOR", "MANAGER", "SUPERVISOR"]}>
          <MainLayout>
            <TestInternet />
          </MainLayout>
        </PrivateRoute>
      }
    />
  </>
);

export default userRoutes;
