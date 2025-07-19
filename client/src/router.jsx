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
        path: "Profile",
        element: <Profile />,
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
        path: "Logout",
        element: <LogOut />,

      },
      {

      },



    ]
  }
]);
