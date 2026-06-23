import { requireSession } from "@/lib/session";
import { Sidebar } from "@/components/Sidebar";
import { UserMenu } from "@/components/UserMenu";

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garde globale : toute page sous ce layout exige une session.
  await requireSession();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-gray-200 bg-white px-6 py-3">
          <UserMenu />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
