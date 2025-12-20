import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (!session.data) {
          // navigate({ to: "/login" });
          return;
        }
        if (session.data.session.activeOrganizationId) {
          // navigate({ to: "/dash" });
          return;
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.organization.create({
        name,
        slug,
      });

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        await fetch("/api/auth-tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Default Token",
            organizationId: data.id,
          }),
        });

        await authClient.organization.setActive({
          organizationId: data.id,
        });

        navigate({ to: "/dash/install" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white relative overflow-hidden selection:bg-white/20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 p-6">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/50 backdrop-blur-sm group">
            <Building2
              size={32}
              className="text-white group-hover:text-accent transition-colors duration-500"
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Create Organization
          </h2>
          <p className="mt-2 text-gray-400">
            Set up your workspace to get started
          </p>
        </div>

        <div className="bg-white/2 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-400 mb-1.5"
                >
                  Organization Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (
                      !slug ||
                      slug === name.toLowerCase().replace(/\s+/g, "-")
                    ) {
                      setSlug(
                        e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      );
                    }
                  }}
                  className="block w-full rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-accent/50 focus:bg-black/40 focus:ring-1 focus:ring-accent/50"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-400 mb-1.5"
                >
                  Organization Slug
                </label>
                <div className="relative">
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="block w-full rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-accent/50 focus:bg-black/40 focus:ring-1 focus:ring-accent/50 font-mono text-sm"
                    placeholder="acme-corp"
                  />
                  {slug && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  This will be used in your tunnel URLs
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white hover:bg-accent px-4 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-white/5 hover:shadow-accent/20"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  Create Organization
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By creating an organization, you agree to our{" "}
          <a
            href="#"
            className="text-gray-400 hover:text-white underline decoration-gray-600 underline-offset-2"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-gray-400 hover:text-white underline decoration-gray-600 underline-offset-2"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
