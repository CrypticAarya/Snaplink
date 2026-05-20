import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import RequireAuth from "@/features/auth/components/RequireAuth";

import LandingPage from "@/features/landing/LandingPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import DashboardPage from "@/features/links/pages/DashboardPage";
import LinkDetailPage from "@/features/links/pages/LinkDetailPage";
import RedirectPage from "@/features/links/pages/RedirectPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <LinkDetailPage />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectPage />,
      },
    ],
  },
]);
