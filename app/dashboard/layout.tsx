import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/actions/logout";
import { getCurrentUser } from "@/lib/auth";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30 p-4">
        <nav className="space-y-1">
          <NavLink
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
          >
            Overview
          </NavLink>
          <NavLink
            href="/dashboard/new"
            icon={<FileText className="h-4 w-4" />}
          >
            New Post
          </NavLink>
          <NavLink
            href="/dashboard/analytics"
            icon={<BarChart3 className="h-4 w-4" />}
          >
            Analytics
          </NavLink>
          <NavLink
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4" />}
          >
            Settings
          </NavLink>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <form action={logout}>
            <Button
              variant="ghost"
              className="w-full justify-start"
              type="submit"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DashboardLayout;

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-start">
        {icon}
        <span className="ml-2">{children}</span>
      </Button>
    </Link>
  );
}
