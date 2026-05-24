import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-bg-base px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-sm text-white/50">TraceStack</p>
            <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5">
              Sign out
            </button>
          </form>
        </header>

        <section className="py-10">
          <div className="glass-panel p-6">
            <p className="text-sm text-white/50">Signed in as</p>
            <p className="mt-2 font-mono text-sm text-brand-secondary">
              {session.user.email}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/60">
              Authentication is active. Organization, project, API key, and log
              views can now be built on top of the authenticated api-server
              contract.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
