"use client";

import React, { useState } from "react";
import { useOrgs, useCreateOrg } from "../../hooks/useOrgs";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import Link from "next/link";
import { Plus, Building2, Users, Activity, BarChart3, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardOverview() {
  const { data: session } = useSession();
  const { data: orgs, isLoading } = useOrgs();
  const createOrg = useCreateOrg();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgName, setOrgName] = useState("");

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    
    createOrg.mutate({ name: orgName }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setOrgName("");
      }
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border-subtle)]">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {getGreeting()}, <span className="text-gradient">{session?.user?.name?.split(' ')[0] || "Developer"}</span>
          </h1>
          <p className="text-gray-400 mt-2">Here's what's happening across your organizations today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-gray-300">View Documentation</Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-[0_0_15px_rgba(108,92,231,0.2)]">
            <Plus size={16} /> New Organization
          </Button>
        </div>
      </div>

      {/* Global Stats Overview (Mocked for visual effect) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <Card className="bg-[var(--color-bg-surface-hover)] border-[var(--color-border-subtle)]">
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-brand-primary)]/20 to-[var(--color-brand-primary)]/5 flex items-center justify-center text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 shadow-inner">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Organizations</p>
              <h3 className="text-2xl font-bold text-white">{isLoading ? "-" : orgs?.length || 0}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-[var(--color-bg-surface-hover)] border-[var(--color-border-subtle)]">
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-brand-secondary)]/20 to-[var(--color-brand-secondary)]/5 flex items-center justify-center text-[var(--color-brand-secondary)] border border-[var(--color-brand-secondary)]/20 shadow-inner">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <h3 className="text-2xl font-bold text-white">{isLoading ? "-" : (orgs?.length || 0) * 2}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-[var(--color-bg-surface-hover)] border-[var(--color-border-subtle)]">
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-brand-warning)]/20 to-[var(--color-brand-warning)]/5 flex items-center justify-center text-[var(--color-brand-warning)] border border-[var(--color-brand-warning)]/20 shadow-inner">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Logs Ingested (30d)</p>
              <h3 className="text-2xl font-bold text-white">45.2K <span className="text-xs text-[var(--color-brand-success)] font-normal">+12%</span></h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
          Your Organizations
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-32" />)}
          </div>
        ) : orgs?.length === 0 ? (
          <EmptyState 
            icon={<Building2 className="text-[var(--color-brand-primary)]" />}
            title="No organizations yet"
            description="Organizations are used to group projects and manage access for your team."
            action={
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus size={16} /> Create Organization
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {orgs?.map((org, index) => (
              <Link key={org.id} href={`/dashboard/orgs/${org.id}`} className="block group">
                <Card className="h-full hover:-translate-y-1 transition-all duration-300 border-[var(--color-border-subtle)] relative overflow-hidden bg-black/40">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-3 border-b border-white/5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-surface-active)] border border-[var(--color-border-subtle)] flex items-center justify-center text-gray-300 group-hover:text-[var(--color-brand-secondary)] group-hover:border-[var(--color-brand-secondary)]/30 transition-colors">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold group-hover:text-white transition-colors">
                            {org.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Created {new Date(org.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </CardHeader>
                  <div className="px-6 py-4 flex gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                      <Activity size={14} className="text-[var(--color-brand-secondary)]" />
                      <span className="font-medium text-white">2</span> Projects
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                      <Users size={14} className="text-[var(--color-brand-primary)]" />
                      <span className="font-medium text-white">1</span> Member
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Organization">
        <form onSubmit={handleCreateOrg} className="space-y-5">
          <p className="text-sm text-gray-400 mb-4">
            Organizations group your projects and API keys, and allow you to invite team members.
          </p>
          <Input 
            label="Organization Name" 
            placeholder="e.g. Acme Corp" 
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            autoFocus
            required
          />
          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={createOrg.isPending} disabled={!orgName.trim()}>
              Create Organization
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
