import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import TentangPartner from './pages/TentangPartner';
import InternalPortal from './pages/InternalPortal';
import PartnerPortal from './pages/PartnerPortal';
import ClientRegister from './pages/ClientRegister';
import DashboardClient from './pages/DashboardClient';
import DashboardPartner from './pages/DashboardPartner';
import InternalDashboard from './pages/dashboard/internal';

// Root route (no component, just a container)
const rootRoute = createRootRoute();

// Public layout route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

// App layout route
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: Home,
});

const tentangPartnerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/tentang-partner-asistenku',
  component: TentangPartner,
});

const internalPortalRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/internal-portal',
  component: InternalPortal,
});

const partnerPortalRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/partner-portal',
  component: PartnerPortal,
});

const clientRegisterRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/client-register',
  component: ClientRegister,
});

// Dashboard routes
const dashboardClientRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard/client',
  component: DashboardClient,
});

const dashboardPartnerRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard/partner',
  component: DashboardPartner,
});

// role="Admin" renders all four role sections as toggleable accordions.
// Change to role="Concierge", role="AdminFinance", or role="Asistenmu"
// to render only that role's single dashboard section without accordion.
const dashboardInternalRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard/internal',
  component: () => <InternalDashboard role="Admin" />,
});

// Create router
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
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

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
