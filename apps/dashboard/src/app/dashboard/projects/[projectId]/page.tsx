"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProject } from "../../../../hooks/useProjects";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "../../../../hooks/useApiKeys";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Modal } from "../../../../components/ui/Modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../components/ui/Table";
import { Badge } from "../../../../components/ui/Badge";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { Plus, Key, Copy, Check, Trash2, AlertTriangle, X, ShieldAlert, Zap } from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const { data: project, isLoading: isLoadingProject } = useProject(projectId);
  const { data: apiKeys, isLoading: isLoadingKeys } = useApiKeys(projectId);
  
  const createApiKey = useCreateApiKey(projectId);
  const revokeApiKey = useRevokeApiKey();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    
    createApiKey.mutate({ name: keyName }, {
      onSuccess: (data) => {
        setIsModalOpen(false);
        setKeyName("");
        // The API returns the raw key ONLY ONCE.
        setNewKey(data.key);
      }
    });
  };

  const handleRevoke = (keyId: string) => {
    if (confirm("Are you sure you want to revoke this API key? This action cannot be undone and any integrations using this key will immediately stop working.")) {
      revokeApiKey.mutate({ keyId });
    }
  };

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getEnvBadgeProps = (env?: string) => {
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
          {isLoadingProject ? (
            <Skeleton variant="text" className="h-10 w-64 mb-2" />
          ) : (
            <div className="flex items-center gap-3 mb-1">
              <Badge {...getEnvBadgeProps(project?.environment)} className="uppercase tracking-wider text-[10px]">
                {project?.environment}
              </Badge>
              <h1 className="text-3xl font-bold text-white tracking-tight">{project?.name}</h1>
            </div>
          )}
          <p className="text-gray-400 mt-2">Manage project settings and authentication keys.</p>
        </div>
      </div>

      {/* New Key Reveal Banner */}
      {newKey && (
        <div className="bg-gradient-to-r from-[var(--color-brand-primary)]/10 to-black border border-[var(--color-brand-primary)]/30 rounded-xl p-6 relative overflow-hidden animate-slide-up shadow-[0_0_30px_rgba(108,92,231,0.15)]">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-brand-primary)] shadow-[0_0_10px_var(--color-brand-primary)]" />
          
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[var(--color-brand-primary)]/20 rounded-xl text-[var(--color-brand-primary)] mt-1 border border-[var(--color-brand-primary)]/20 animate-pulse-glow">
              <Key size={24} />
            </div>
            
            <div className="flex-1 pr-8">
              <h3 className="text-xl font-bold text-white mb-2">Here is your new API Key</h3>
              <p className="text-sm text-gray-300 mb-5 leading-relaxed max-w-2xl">
                Please copy this key and store it securely. For security reasons, <strong className="text-white bg-[var(--color-brand-error)]/20 px-1 rounded">it will not be shown again</strong>. If you lose it, you will need to generate a new one.
              </p>
              
              <div className="flex items-center gap-3 bg-black/60 border border-[var(--color-border-subtle)] rounded-lg p-2 max-w-2xl relative group">
                <code className="flex-1 px-3 font-mono text-emerald-400 text-sm truncate select-all">
                  {newKey}
                </code>
                <Button onClick={copyToClipboard} variant={copied ? "primary" : "secondary"} className="gap-2 shrink-0 h-9 transition-all">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Key"}
                </Button>
                
                {/* Glow behind code block */}
                <div className="absolute inset-0 bg-emerald-400/5 blur-md rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setNewKey(null)}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* API Keys Table */}
      <Card className="animate-slide-up border-[var(--color-border-subtle)]" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="flex flex-row justify-between items-center border-b border-[var(--color-border-subtle)] pb-5 mb-0 bg-[var(--color-bg-surface)]/30">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key size={18} className="text-[var(--color-brand-primary)]" /> API Keys
            </CardTitle>
            <CardDescription className="mt-1">Keys used to authenticate SDK requests to the ingestion API.</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" className="gap-2 shadow-[0_0_15px_rgba(108,92,231,0.2)]">
            <Plus size={16} /> Generate Key
          </Button>
        </CardHeader>
        
        <div className="p-0">
          {isLoadingKeys ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} variant="table-row" className="h-12" />)}
            </div>
          ) : apiKeys?.length === 0 ? (
            <EmptyState 
              icon={<Key className="text-[var(--color-brand-primary)]" />}
              title="No API Keys"
              description="Generate an API key to start authenticating requests from your application."
              action={
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                  <Plus size={16} /> Generate Key
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader className="bg-[var(--color-bg-base)] border-b border-[var(--color-border-subtle)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4">Name</TableHead>
                  <TableHead className="py-4">Prefix</TableHead>
                  <TableHead className="py-4">Status</TableHead>
                  <TableHead className="py-4">Created</TableHead>
                  <TableHead className="text-right py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys?.map((key) => (
                  <TableRow key={key.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface)] transition-colors group">
                    <TableCell className="font-medium text-white py-4">
                      <div className="flex items-center gap-2">
                        {key.name}
                        {key.isActive && <span className="flex w-2 h-2 rounded-full bg-[var(--color-brand-success)] shadow-[0_0_5px_var(--color-brand-success)]" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-gray-400 py-4">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/5">
                        <Zap size={12} className="text-[var(--color-brand-primary)]" />
                        {key.prefix}<span className="text-gray-600">••••••••</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant={key.isActive ? "success" : "default"} className="bg-opacity-20 border-opacity-30">
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 py-4 text-sm">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {key.isActive && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[var(--color-brand-error)] hover:text-white hover:bg-[var(--color-brand-error)] opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                          onClick={() => handleRevoke(key.id)}
                          disabled={revokeApiKey.isPending}
                          title="Revoke Key"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate API Key">
        <form onSubmit={handleCreateKey} className="space-y-5">
          <p className="text-sm text-gray-400 mb-4">
            API keys are bound to this project. Use them in your application code to authenticate with the ingestion API.
          </p>
          
          <Input 
            label="Key Name" 
            placeholder="e.g. Production Frontend Server" 
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            autoFocus
            required
          />
          
          <div className="bg-[var(--color-brand-warning)]/10 border border-[var(--color-brand-warning)]/20 rounded-lg p-4 flex gap-3 mt-4 text-sm">
            <ShieldAlert size={20} className="shrink-0 text-[var(--color-brand-warning)]" />
            <div>
              <p className="text-[var(--color-brand-warning)] font-medium mb-1">Security Notice</p>
              <p className="text-gray-300 leading-relaxed">Once generated, the full key will only be shown once. Be ready to copy it to a secure location (like a secret manager or .env file).</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[var(--color-border-subtle)]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={createApiKey.isPending} disabled={!keyName.trim()}>
              Generate Key
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
