import { ErrorBoundary } from "react-error-boundary";
import PageError from "@/pages/errors/PageError";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { accessToken } = useUserToken();
  const navigate = useNavigate();

  // const check = useCallback(() => {
  //   if (!accessToken) {
  //     navigate('/login', { replace: true });
  //   }
  // }, [navigate, accessToken]);

  // useEffect(() => {
  //   check();
  // }, [check]);

  return (
    <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>
  );
}
