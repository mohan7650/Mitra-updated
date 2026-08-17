"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ShoppingBag, User, PawPrint } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", href: "/home", icon: Home },
  { id: "community", label: "Community", href: "/community", icon: Users },
  { id: "shop", label: "Shop", href: "/shop", icon: ShoppingBag },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20">
      <div className="relative mx-auto max-w-md">
        {/* Centre paw FAB -> Mitra Care hub */}
        <Link
          href="/care"
          aria-label="Mitra Care"
          className="absolute -top-6 left-1/2 z-10 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-coral-500 text-white shadow-card ring-4 ring-cream-100 transition active:scale-95"
        >
          <PawPrint className="h-7 w-7 fill-current" />
        </Link>

        <div className="flex items-center justify-between rounded-t-3xl bg-cream-50 px-6 pb-5 pt-3 shadow-nav">
          {tabs.slice(0, 2).map((t) => (
            <TabLink key={t.id} tab={t} active={pathname === t.href} />
          ))}
          <span className="w-16" aria-hidden />
          {tabs.slice(2).map((t) => (
            <TabLink key={t.id} tab={t} active={pathname === t.href} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function TabLink({
  tab,
  active,
}: {
  tab: { id: string; label: string; href: string; icon: typeof Home };
  active: boolean;
}) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      className={`flex flex-col items-center gap-1 transition ${
        active ? "text-coral-500" : "text-bark-500"
      }`}
    >
      <Icon className="h-6 w-6" strokeWidth={active ? 2.4 : 2} />
      <span className={`text-[11px] ${active ? "font-700" : "font-500"}`}>{tab.label}</span>
    </Link>
  );
}
