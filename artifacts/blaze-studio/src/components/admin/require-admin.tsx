import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  useAdminGetSession,
  getAdminGetSessionQueryKey,
} from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { data, isLoading, isError } = useAdminGetSession({
    query: {
      queryKey: getAdminGetSessionQueryKey(),
      retry: false,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  });

  const authenticated = data?.authenticated === true;

  useEffect(() => {
    if (!isLoading && !authenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, authenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking session…
        </div>
      </div>
    );
  }

  if (isError || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-600">Redirecting to sign in…</div>
      </div>
    );
  }

  return <>{children}</>;
}
