"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Tableau de bord", icon: "▦" },
  { href: "/clients", label: "Clients", icon: "👤" },
  { href: "/contrats", label: "Contrats", icon: "📄" },
  { href: "/sinistres", label: "Sinistres", icon: "⚠️" },
  { href: "/paiements", label: "Paiements", icon: "💶" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
          C
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-gray-900">
            Claire
          </p>
          <p className="text-xs leading-tight text-gray-400">Assurance</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 text-xs text-gray-400">
        Claire Assurance v0.1
      </div>
    </aside>
  );
}
