import { ErrorBoundary } from "react-error-boundary";
import PageError from "@/pages/errors/PageError";
import { ReactNode, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserToken } from "@/store/user-store";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { accessToken } = useUserToken();
  const navigate = useNavigate();

  const check = useCallback(() => {
    if (!accessToken) {
      navigate('/login', { replace: true });
    }
  }, [navigate, accessToken]);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <ErrorBoundary FallbackComponent={PageError}>{children as any}</ErrorBoundary>
  );
}
