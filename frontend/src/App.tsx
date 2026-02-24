import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import TentangPartner from "./pages/TentangPartner";
import InternalPortal from "./pages/InternalPortal";
import PartnerPortal from "./pages/PartnerPortal";
import ClientRegister from "./pages/ClientRegister";
import DashboardClient from "./pages/DashboardClient";
import DashboardPartner from "./pages/DashboardPartner";
import InternalDashboard from "./pages/dashboard/internal";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: Home,
});

const tentangPartnerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/tentang-partner-asistenku",
  component: TentangPartner,
});

const internalPortalRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/internal-portal",
  component: InternalPortal,
});

const partnerPortalRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/partner-portal",
  component: PartnerPortal,
});

const clientRegisterRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/client-register",
  component: ClientRegister,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app-layout",
  component: AppLayout,
});

const dashboardClientRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/client",
  component: DashboardClient,
});

const dashboardPartnerRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/partner",
  component: DashboardPartner,
});

const dashboardInternalRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard/internal",
  component: InternalDashboard,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    tentangPartnerRoute,
    internalPortalRoute,
    partnerPortalRoute,
    clientRegisterRoute,
  ]),
  appLayoutRoute.addChildren([
    dashboardClientRoute,
    dashboardPartnerRoute,
    dashboardInternalRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
