"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Search, Bell, Menu } from "lucide-react";
import { useOrg, useOrgs } from "../../hooks/useOrgs";
import { useProject, useProjects } from "../../hooks/useProjects";

export function TopBar() {
  const params = useParams();
  const pathname = usePathname();
  
  const orgId = params.orgId as string | undefined;
  const projectId = params.projectId as string | undefined;

  const { data: org } = useOrg(orgId || "");
  const { data: project } = useProject(projectId || "");

  // Generate breadcrumbs based on route
  const breadcrumbs = [];
  
  if (pathname.startsWith("/dashboard")) {
    breadcrumbs.push({ label: "Dashboard", href: "/dashboard" });
  }

  if (org) {
    breadcrumbs.push({ label: org.name, href: `/dashboard/orgs/${org.id}` });
  }

  if (project) {
    breadcrumbs.push({ label: project.name, href: `/dashboard/projects/${project.id}` });
    
    if (pathname.includes("/logs")) {
      breadcrumbs.push({ label: "Logs", href: `/dashboard/projects/${project.id}/logs` });
    }
  }

  return (
    <header className="h-16 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle could go here */}
        <button className="md:hidden text-gray-400 hover:text-white">
          <Menu size={20} />
        </button>
        
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center text-sm font-medium">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <ChevronRight size={14} className="mx-2 text-gray-500" />}
              <Link 
                href={crumb.href}
                className={index === breadcrumbs.length - 1 
                  ? "text-white" 
                  : "text-gray-400 hover:text-gray-200 transition-colors"
                }
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-md hover:border-[var(--color-border-focus)] transition-colors">
          <Search size={14} />
          <span>Search...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[var(--color-bg-surface-hover)] rounded ml-2">⌘K</kbd>
        </button>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[var(--color-bg-surface)]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-brand-primary)] rounded-full animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}
