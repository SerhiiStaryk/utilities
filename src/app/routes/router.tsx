import { createBrowserRouter } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import { LoginPage } from "../../pages/Auth/LoginPage";
import { DashboardPage } from "../../pages/Dashboard/DashboardPage";
import { AddressListPage } from "../../pages/Address/AddressListPage";
import { CreateAddressPage } from "../../pages/Address/CreateAddressPage";
import { EditAddressPage } from "../../pages/Address/EditAddressPage";
import { AddressDetailsPage } from "../../pages/Address/AddressDetailsPage";
import { AddressServicesPage } from "../../pages/Address/AddressServicesPage";
import { AddressYearPage } from "../../pages/Address/AddressYearPage";
import { AddressReadingPage } from "../../pages/Address/AddressReadingPage";
import { SettingsPage } from "../../pages/Settings/SettingPage";
import { ProfilePage } from "../../pages/Settings/ProfilePage";
import { UsersPage } from "../../pages/Users/UsersPage";
import { PrivateRoute } from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "address-list",
        element: <AddressListPage />,
      },
      { path: "address-list/create", element: <CreateAddressPage /> },
      { path: "address-list/edit/:id", element: <EditAddressPage /> },
      { path: "address-list/:id", element: <AddressDetailsPage /> },
      { path: "address-list/:id/services", element: <AddressServicesPage /> },
      { path: "address-list/:id/year/:year", element: <AddressYearPage /> },
      { path: "address-list/:id/year/:year/readings", element: <AddressReadingPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "settings/profile", element: <ProfilePage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
]);
