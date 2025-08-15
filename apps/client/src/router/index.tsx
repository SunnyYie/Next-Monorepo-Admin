import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router';
import { usePermissionRoutes } from './hooks/usePermissionRoutes';
import { ErrorBoundary } from 'react-error-boundary';
import { AppRouteObject } from './types';
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

import ProtectedRoute from '@/components/common/protected-route';
import CircleLoading from '@/components/common/circle-loading';
import Error from '@/pages/errors/PageError';
import Login from '@/pages/login';
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import UserEventList from '@/pages/dashboard/user-event-list';
import TrackingDemo from '@/pages/tracking';

const PageError = lazy(() => import('@/pages/errors/PageError'));
const Page403 = lazy(() => import('@/pages/errors/Page403'));
const Page404 = lazy(() => import('@/pages/errors/Page404'));
const Page500 = lazy(() => import('@/pages/errors/Page500'));

const PUBLIC_ROUTE: AppRouteObject = {
  path: '/login',
  element: (
    <ErrorBoundary FallbackComponent={Error}>
      <Login />
    </ErrorBoundary>
  ),
};

const ERROR_ROUTES: AppRouteObject = {
  element: (
    // <ProtectedRoute>
    //   </ProtectedRoute>
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    { path: '403', element: <Page403 /> },
    { path: '500', element: <Page500 /> },
    { path: 'error', element: <PageError /> },
    { path: '*', element: <Page404 /> },
  ],
};

export default function AppRouter() {
  const permissionRoutes = usePermissionRoutes();
  const PROTECTED_ROUTE: AppRouteObject = {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/workspace" replace />,
          },
          {
            path: 'workspace',
            element: <Dashboard />,
          },
          {
            path: 'userEvent',
            element: <UserEventList />,
          },
        ],
      },
      {
        path: 'tracking',
        element: <TrackingDemo />,
      },
      // ...permissionRoutes,
    ],
  };

  const routes = [PUBLIC_ROUTE, PROTECTED_ROUTE, ERROR_ROUTES] as RouteObject[];
  const router = createBrowserRouter(routes);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
