import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { AllFeedbacksPage } from "./pages/AllFeedbacksPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPanelPage } from "./pages/AdminPanelPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { TeamPage } from "./pages/TeamPage";
import { GlobalError } from "./components/GlobalError";
import { PrincipalLoginPage } from "./pages/PrincipalLoginPage";
import { PrincipalDashboardPage } from "./pages/PrincipalDashboardPage";

const baseRoutes = [
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: AuthPage,
  },
  {
    path: "/signup",
    Component: AuthPage,
  },
  {
    path: "/forgot-password",
    Component: AuthPage,
  },
  {
    path: "/feedbacks",
    Component: AllFeedbacksPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/admin",
    Component: AdminPanelPage,
  },
  {
    path: "/event/:id",
    Component: EventDetailsPage,
  },
  {
    path: "/admin-login",
    Component: AdminLoginPage,
  },
  {
    path: "/activities",
    Component: ActivitiesPage,
  },
  {
    path: "/team",
    Component: TeamPage,
  },
    {
      path: "/principal-login",
      Component: PrincipalLoginPage,
    },
    {
      path: "/principal-dashboard",
      Component: PrincipalDashboardPage,
    },
  ];

export const router = createBrowserRouter(
  baseRoutes.map(route => ({
    ...route,
    errorElement: <GlobalError />
  }))
);
