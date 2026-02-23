import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TentangPartner from './pages/TentangPartner';
import InternalPortal from './pages/InternalPortal';
import PartnerPortal from './pages/PartnerPortal';
import ClientRegister from './pages/ClientRegister';

// Layout component with Header and Footer
function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const tentangPartnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tentang-partner-asistenku',
  component: TentangPartner,
});

const internalPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/internal-portal',
  component: InternalPortal,
});

const partnerPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/partner-portal',
  component: PartnerPortal,
});

const clientRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client-register',
  component: ClientRegister,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  tentangPartnerRoute,
  internalPortalRoute,
  partnerPortalRoute,
  clientRegisterRoute,
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
