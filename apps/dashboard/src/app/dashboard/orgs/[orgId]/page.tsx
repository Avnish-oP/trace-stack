"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useOrg } from "../../../../hooks/useOrgs";
import { useProjects, useCreateProject } from "../../../../hooks/useProjects";
import { Card, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Modal } from "../../../../components/ui/Modal";
import { Badge } from "../../../../components/ui/Badge";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { Skeleton } from "../../../../components/ui/Skeleton";
import Link from "next/link";
import { Plus, Settings2, Activity, Key, Calendar, Server, ChevronRight } from "lucide-react";

export default function OrgDetail() {
  const params = useParams();
  const orgId = params.orgId as string;
  
  const { data: org, isLoading: isLoadingOrg } = useOrg(orgId);
  const { data: projects, isLoading: isLoadingProjects } = useProjects(orgId);
  const createProject = useCreateProject(orgId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [environment, setEnvironment] = useState<"development" | "staging" | "production">("development");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    
    createProject.mutate({ name: projectName, environment }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setProjectName("");
        setEnvironment("development");
      }
    });
  };

  const getEnvBadgeProps = (env: string) => {
    switch(env) {
      case "production": return { variant: "success" as const, showDot: true };
      case "staging": return { variant: "warning" as const, showDot: true };
      default: return { variant: "default" as const, showDot: true };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
        <div>
          {isLoadingOrg ? (
            <Skeleton variant="text" className="h-10 w-64 mb-2" />
          ) : (
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              {org?.name}
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold border-white/10 text-gray-400">Organization</Badge>
            </h1>
          )}
          <p className="text-gray-400 mt-2">Manage projects and settings for this organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-300">Settings</Button>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" className="gap-2 shadow-[0_0_15px_rgba(108,92,231,0.2)]">
            <Plus size={16} /> New Project
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-active)] flex items-center justify-center text-gray-400 border border-[var(--color-border-subtle)]">
            <Server size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</p>
            <p className="text-xl font-bold text-white">{isLoadingProjects ? "-" : projects?.length || 0}</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-active)] flex items-center justify-center text-gray-400 border border-[var(--color-border-subtle)]">
            <Key size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total API Keys</p>
            <p className="text-xl font-bold text-white">-</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-active)] flex items-center justify-center text-gray-400 border border-[var(--color-border-subtle)]">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Log Volume (30d)</p>
            <p className="text-xl font-bold text-white">-</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-active)] flex items-center justify-center text-gray-400 border border-[var(--color-border-subtle)]">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</p>
            <p className="text-sm font-medium text-white pt-1">{org ? new Date(org.createdAt).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
          Projects
        </h2>

        {isLoadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-40" />)}
          </div>
        ) : projects?.length === 0 ? (
          <EmptyState 
            icon={<Settings2 className="text-[var(--color-brand-primary)]" />}
            title="No projects found"
            description="Create a project to generate API keys and start tracking your application logs."
            action={
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus size={16} /> Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {projects?.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block group">
                <Card className="h-full hover:-translate-y-1 transition-all duration-300 border-[var(--color-border-subtle)] relative overflow-hidden bg-black/40">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge {...getEnvBadgeProps(project.environment)} className="uppercase tracking-wider text-[10px]">
                        {project.environment}
                      </Badge>
                      <div className="w-8 h-8 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold group-hover:text-white transition-colors mb-1">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 font-mono">
                      {project.id}
                    </CardDescription>
                  </CardHeader>

                  <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                      <Activity size={14} className={project.environment === "production" ? "text-[var(--color-brand-success)]" : "text-[var(--color-brand-secondary)]"} />
                      <span className="font-medium text-white">0</span> <span className="text-xs">Logs (24h)</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreateProject} className="space-y-5">
          <p className="text-sm text-gray-400 mb-4">
            Projects separate your logs by environment or service. Each project has its own API keys.
          </p>
          
          <Input 
            label="Project Name" 
            placeholder="e.g. Payment Gateway API" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            autoFocus
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Environment</label>
            <div className="relative">
              <select 
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as "development" | "staging" | "production")}
                className="w-full bg-black/50 border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-colors"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={createProject.isPending} disabled={!projectName.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
