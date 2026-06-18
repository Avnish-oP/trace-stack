"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { 
  Home, Folder, Key, Activity, Settings, LogOut, 
  ChevronRight, ChevronDown, Plus, PanelLeftClose, PanelLeftOpen 
} from "lucide-react";
import { useOrgs } from "../../hooks/useOrgs";
import { useProjects } from "../../hooks/useProjects";
import { signOut, useSession } from "next-auth/react";

// Sub-component for an Org in the sidebar tree
function OrgTreeItem({ org, isExpanded, onToggle, isMini }: { 
  org: any; 
  isExpanded: boolean; 
  onToggle: () => void;
  isMini: boolean;
}) {
  const pathname = usePathname();
  const { data: projects } = useProjects(org.id);

  if (isMini) {
    return (
      <div className="relative group">
        <Link
          href={`/dashboard/orgs/${org.id}`}
          className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg mb-2 transition-colors ${
            pathname.includes(org.id) ? "bg-[var(--color-bg-surface-hover)] border border-[var(--color-border-subtle)]" : "hover:bg-[var(--color-bg-surface)] text-gray-400"
          }`}
        >
          <Folder size={18} />
        </Link>
        {/* Tooltip */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {org.name}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button 
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[var(--color-bg-surface)] rounded-md transition-colors group"
      >
        <span className="text-gray-500 group-hover:text-gray-300 transition-colors">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="flex-1 text-left truncate font-medium">{org.name}</span>
      </button>

      {isExpanded && (
        <div className="ml-5 mt-1 pl-2 border-l border-[var(--color-border-subtle)] space-y-1">
          <Link 
            href={`/dashboard/orgs/${org.id}`}
            className={`block px-2 py-1.5 text-xs rounded-md transition-colors ${
              pathname === `/dashboard/orgs/${org.id}` 
                ? "bg-[var(--color-bg-surface-hover)] text-[var(--color-brand-secondary)] font-medium" 
                : "text-gray-400 hover:text-white hover:bg-[var(--color-bg-surface)]"
            }`}
          >
            Overview
          </Link>
          
          {projects?.map((project: any) => {
            const isProjectActive = pathname.includes(`/projects/${project.id}`);
            return (
              <div key={project.id} className="relative">
                {/* Active indicator border */}
                {isProjectActive && (
                  <div className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[var(--color-brand-primary)] rounded-full" />
                )}
                <Link 
                  href={`/dashboard/projects/${project.id}`}
                  className={`block px-2 py-1.5 text-xs truncate rounded-md transition-colors ${
                    isProjectActive
                      ? "text-white font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-[var(--color-bg-surface)]"
                  }`}
                >
                  {project.name}
                </Link>
                
                {isProjectActive && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className={`flex items-center gap-2 px-2 py-1 text-[11px] rounded transition-colors ${
                        pathname === `/dashboard/projects/${project.id}`
                          ? "text-[var(--color-brand-primary)]"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Settings size={12} /> Settings
                    </Link>
                    <Link
                      href={`/dashboard/projects/${project.id}/logs`}
                      className={`flex items-center gap-2 px-2 py-1 text-[11px] rounded transition-colors ${
                        pathname.includes("/logs")
                          ? "text-[var(--color-brand-primary)]"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Activity size={12} /> Logs
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: orgs } = useOrgs();
  
  const [isMini, setIsMini] = useState(false);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  const toggleOrg = (id: string) => {
    const newSet = new Set(expandedOrgs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedOrgs(newSet);
  };

  // Expand first org by default if available and none expanded
  React.useEffect(() => {
    if (orgs?.length && expandedOrgs.size === 0) {
      setExpandedOrgs(new Set([orgs[0].id]));
    }
  }, [orgs]);

  return (
    <div 
      className={`h-screen border-r border-[var(--color-border-subtle)] bg-black/40 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out ${
        isMini ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border-subtle)]">
        {!isMini && (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--color-brand-primary)]/20 group-hover:scale-105 transition-transform">
              TS
            </div>
            <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              TraceStack
            </span>
          </Link>
        )}
        {isMini && (
          <Link href="/dashboard" className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center font-bold text-white shadow-lg">
            TS
          </Link>
        )}
        
        <button 
          onClick={() => setIsMini(!isMini)}
          className={`text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-[var(--color-bg-surface)] ${isMini ? 'hidden' : 'block'}`}
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {isMini && (
        <button 
          onClick={() => setIsMini(false)}
          className="mx-auto mt-4 text-gray-500 hover:text-white p-2 rounded-md hover:bg-[var(--color-bg-surface)]"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="px-3 space-y-4">
          <div>
            <Link 
              href="/dashboard"
              className={`flex items-center ${isMini ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2'} rounded-lg transition-colors group ${
                pathname === "/dashboard" 
                  ? "bg-[var(--color-bg-surface-active)] text-white border border-[var(--color-border-subtle)]" 
                  : "text-gray-400 hover:bg-[var(--color-bg-surface)] hover:text-white"
              }`}
              title={isMini ? "Overview" : undefined}
            >
              <Home size={18} className={pathname === "/dashboard" ? "text-[var(--color-brand-primary)]" : ""} />
              {!isMini && <span>Overview</span>}
            </Link>
          </div>

          <div className="pt-2">
            {!isMini && (
              <div className="px-3 mb-2 flex items-center justify-between group">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Organizations
                </span>
                <Link href="/dashboard" className="text-gray-600 hover:text-[var(--color-brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={14} />
                </Link>
              </div>
            )}
            
            <div className="space-y-1">
              {orgs?.map((org: any) => (
                <OrgTreeItem 
                  key={org.id} 
                  org={org} 
                  isExpanded={expandedOrgs.has(org.id)}
                  onToggle={() => toggleOrg(org.id)}
                  isMini={isMini}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/50">
        <div className={`flex items-center ${isMini ? 'justify-center' : 'gap-3'} px-2 py-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors group cursor-pointer`}>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 flex items-center justify-center text-sm font-medium border border-gray-700 group-hover:border-gray-500 transition-colors">
              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--color-bg-base)] rounded-full"></div>
          </div>
          
          {!isMini && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">
                  {session?.user?.email}
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); signOut({ callbackUrl: "/login" }); }}
                className="text-gray-500 hover:text-[var(--color-brand-error)] transition-colors opacity-0 group-hover:opacity-100"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
