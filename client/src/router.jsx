import {
  createBrowserRouter,
} from "react-router-dom";

import LoginPage from "./features/auth/loginPage";
import RegisterPage from "./features/auth/registerPage";
import ValidationPage from "./features/auth/ValidationPage";

import ForgotPassword from "./features/auth/ForgotPassword";
import Forgotvalide from "./features/auth/forgotvalide";

import DashboardPages from "./routes/dashboard";
import Home from "./features/auth/home";
import Profile from "./features/auth/user";
import DashboardComponent from "./features/auth/dashboard";

import Nombresconecter from "./features/auth/Nombresconecter";
import DocumentationPage from "./components/slidebar/Documentations";
import { LogOut } from "lucide-react";
import App from "./components/Alertes/App";

import AdminDashboard from "./components/slidebar/PageAccueil/AdminDashboard";
import MedecinDashboard from "./components/slidebar/PageAccueil/MedecinDashboard";
import MedecinProfile from "./components/Medecins/MedecinProfile";
import MesPatients from "./components/Patients/MesPatients";
import PatientProfile from "./components/Patients/PatientProfile";
import Messagerie from "./components/Messagerie/Messagerie";
import NotificationList from "./components/Notifications/NotificationCkecker";
import NotificationChecker from "./components/Notifications/NotificationCkecker";
import MedecinNotifications from "./components/Medecins/MedecinNotificaiton";
import PatientDashboard from "./components/Patients/PatientNotification";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/validatecode",
    element: <Forgotvalide />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <RegisterPage />,

  },
  {
    path: "/validation",
    element: <ValidationPage />,

  },


  {
    path: "/dashboard",
    element: <DashboardPages />,
    children: [
      {
        path: "",
        element: <DashboardComponent />,
      },
      {
        path: "admindashboard",
        element: <AdminDashboard />,
      },
      {
        path: "messagerie",
        element: <Messagerie />,
      },
      {
        path: "notifications",
        element: <NotificationChecker />,
      },
      {
        path: "medecinnotifications",
        element: <MedecinNotifications />,
      },
      {
        path: "patientnotifications",
        element: <PatientDashboard />,
      },


      {
        path: "mespatients",
        element: <MesPatients />,
      },
      {
        path: "patientprofile/:id",
        element: <PatientProfile />,
      },
      {
        path: "medecindashboard/:id",
        element: <MedecinDashboard />,
      },

      {
        path: "medecinprofile/:id",
        element: <MedecinProfile />,
      },
      {
        path: "Profile",
        element: <Profile />,
      },
      {
        path: "alertes",
        element: <App />,
      },

      {
        path: "nombreconect",
        element: <Nombresconecter />,
      },


      {
        path: "docs",
        element: <DocumentationPage />,
      },

      {
        path: "logout",
        element: <LogOut />,

      },
      {

      },



    ]
  }
]);
