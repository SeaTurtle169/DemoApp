// routes/adminRoutes.js
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import UserManagement from "../pages/AccountManagement";
import CompetencyManagement from "../pages/CompetencyManagement";
import NewReportPage from "../pages/NewReportPage";
import PersonnelDetail from "../pages/PersonnelDetail";
import PersonnelList from "../pages/PersonnelList";
import PersonnelManagement from "../pages/PersonnelManagement";
import PrivateRoute from "./PrivateRoute";

const adminRoutes = (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <UserManagement />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/account"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <UserManagement />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/personnelListByDepartment"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <PersonnelList />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/personnel/:id"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <PersonnelDetail />
          </MainLayout>
        </PrivateRoute>
      }
    />
      <Route
      path="/admin/newreport/:id"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <NewReportPage />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/competency"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <CompetencyManagement />
          </MainLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admin/personnel"
      element={
        <PrivateRoute roles={["ADMIN"]}>
          <MainLayout>
            <PersonnelManagement />
          </MainLayout>
        </PrivateRoute>
      }
    />
  </>
);

export default adminRoutes;
