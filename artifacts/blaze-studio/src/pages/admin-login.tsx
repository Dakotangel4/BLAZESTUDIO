import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Flame, Loader2, Lock } from "lucide-react";
import {
  useAdminLogin,
  useAdminGetSession,
  getAdminGetSessionQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const session = useAdminGetSession({
    query: {
      queryKey: getAdminGetSessionQueryKey(),
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (session.data?.authenticated) {
      setLocation("/admin/leads");
    }
  }, [session.data, setLocation]);

  const login = useAdminLogin({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminGetSessionQueryKey(),
        });
        toast.success("Welcome back");
        setLocation("/admin/leads");
      },
      onError: (err: unknown) => {
        const status =
          typeof err === "object" && err !== null && "status" in err
            ? (err as { status?: number }).status
            : undefined;
        setError(
          status === 401
            ? "Incorrect password."
            : status === 503
              ? "Admin login is not configured on the server yet."
              : "Could not sign in. Please try again.",
        );
      },
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError("Enter your admin password.");
      return;
    }
    login.mutate({ data: { password } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-500 text-white shadow-lg shadow-orange-500/30">
            <Flame className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">
            Blaze Studio Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to view and manage leads.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <label
            htmlFor="admin-password"
            className="block text-xs font-medium uppercase tracking-wider text-slate-400"
          >
            Password
          </label>
          <div className="mt-2 relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={login.isPending}
              className="w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={login.isPending}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
          >
            {login.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
