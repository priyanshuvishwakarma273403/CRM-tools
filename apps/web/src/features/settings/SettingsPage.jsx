import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTenantStore } from '../../store/useTenantStore';
import { authApi } from '../../api/authApi';
import { mcpApi } from '../../api/mcpApi';
import { developerApi } from '../../api/developerApi';
import {
  Building2,
  Users,
  Shield,
  Key,
  CreditCard,
  Smartphone,
  Cpu,
  Webhook as WebhookIcon,
  RefreshCw,
  Fingerprint,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentOrganization } = useTenantStore();
  const [activeTab, setActiveTab] = useState('Sessions & Passkeys');

  // Multi-Device Sessions & Passkeys state
  const [sessions, setSessions] = useState([]);
  const [passkeys, setPasskeys] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // MCP Governance state
  const [mcpTools, setMcpTools] = useState([]);
  const [mcpServers, setMcpServers] = useState([]);
  const [mcpAuditLogs, setMcpAuditLogs] = useState([]);
  const [newServerName, setNewServerName] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');

  // Developer Platform state
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdRawKey, setCreatedRawKey] = useState(null);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const tabs = [
    { label: 'Sessions & Passkeys', icon: Fingerprint },
    { label: 'MCP Governance', icon: Cpu },
    { label: 'Developer Platform', icon: Terminal },
    { label: 'Organization', icon: Building2 },
    { label: 'Users & Team', icon: Users },
    { label: 'Roles & RBAC', icon: Shield },
    { label: 'Billing & Plan', icon: CreditCard },
  ];

  useEffect(() => {
    if (activeTab === 'Sessions & Passkeys') {
      loadSessionsAndPasskeys();
    } else if (activeTab === 'MCP Governance') {
      loadMcpData();
    } else if (activeTab === 'Developer Platform') {
      loadDeveloperData();
    }
  }, [activeTab]);

  const loadSessionsAndPasskeys = async () => {
    setLoadingSessions(true);
    try {
      const [sessRes, passRes] = await Promise.allSettled([
        authApi.getSessions(),
        authApi.getPasskeys(),
      ]);
      if (sessRes.status === 'fulfilled' && sessRes.value.data?.data) {
        setSessions(sessRes.value.data.data);
      }
      if (passRes.status === 'fulfilled' && passRes.value.data?.data) {
        setPasskeys(passRes.value.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (id) => {
    try {
      await authApi.revokeSession(id);
      loadSessionsAndPasskeys();
    } catch (e) {
      alert('Failed to revoke session: ' + e.message);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    try {
      await authApi.revokeAllOtherSessions();
      loadSessionsAndPasskeys();
    } catch (e) {
      alert('Failed to revoke sessions: ' + e.message);
    }
  };

  const loadMcpData = async () => {
    try {
      const [toolsRes, serversRes, auditRes] = await Promise.allSettled([
        mcpApi.listTools(),
        mcpApi.getServers(),
        mcpApi.getAuditLogs({ size: 10 }),
      ]);
      if (toolsRes.status === 'fulfilled' && toolsRes.value.data?.data) {
        setMcpTools(toolsRes.value.data.data);
      }
      if (serversRes.status === 'fulfilled' && serversRes.value.data?.data) {
        setMcpServers(serversRes.value.data.data);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value.data?.data?.items) {
        setMcpAuditLogs(auditRes.value.data.data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterMcpServer = async (e) => {
    e.preventDefault();
    if (!newServerName || !newServerUrl) return;
    try {
      await mcpApi.registerServer({ name: newServerName, serverUrl: newServerUrl });
      setNewServerName('');
      setNewServerUrl('');
      loadMcpData();
    } catch (e) {
      alert('Failed to register server: ' + e.message);
    }
  };

  const loadDeveloperData = async () => {
    try {
      const [keysRes, hooksRes] = await Promise.allSettled([
        developerApi.listApiKeys(),
        developerApi.listWebhooks(),
      ]);
      if (keysRes.status === 'fulfilled' && keysRes.value.data?.data) {
        setApiKeys(keysRes.value.data.data);
      }
      if (hooksRes.status === 'fulfilled' && hooksRes.value.data?.data) {
        setWebhooks(hooksRes.value.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    if (!newKeyName) return;
    try {
      const res = await developerApi.createApiKey({ name: newKeyName, scopes: 'read:all,write:leads,write:deals' });
      if (res.data?.data?.rawKey) {
        setCreatedRawKey(res.data.data.rawKey);
      }
      setNewKeyName('');
      loadDeveloperData();
    } catch (e) {
      alert('Failed to create key: ' + e.message);
    }
  };

  const handleRevokeApiKey = async (id) => {
    try {
      await developerApi.revokeApiKey(id);
      loadDeveloperData();
    } catch (e) {
      alert('Failed to revoke key: ' + e.message);
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    if (!newWebhookUrl) return;
    try {
      await developerApi.createWebhook({ url: newWebhookUrl, events: ['*'] });
      setNewWebhookUrl('');
      loadDeveloperData();
    } catch (e) {
      alert('Failed to register webhook: ' + e.message);
    }
  };

  const handleTestWebhook = async (id) => {
    try {
      await developerApi.testWebhook(id);
      alert('Test ping sent successfully!');
    } catch (e) {
      alert('Webhook ping failed: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM OS Governance & Platform Control"
        subtitle="Manage unified identity, passkeys, multi-device sessions, Model Context Protocol (MCP) gateways, and developer APIs."
        breadcrumbs={['CRM', 'Settings']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <Card className="p-2 space-y-1 h-fit border border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.label
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: Sessions & Passkeys */}
          {activeTab === 'Sessions & Passkeys' && (
            <div className="space-y-6">
              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-brand-600" />
                      Active Device Sessions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Logged in devices across Desktop, Web, and Mobile. You can remotely revoke any session.
                    </p>
                  </div>
                  <Button variant="danger" size="sm" onClick={handleRevokeAllOtherSessions}>
                    Revoke All Other Sessions
                  </Button>
                </div>

                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 text-center">
                      No external sessions detected. Current session is authenticated.
                    </div>
                  ) : (
                    sessions.map((sess) => (
                      <div
                        key={sess.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {sess.deviceType} • {sess.os || 'Desktop OS'}
                            </span>
                            {sess.isRevoked ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded">
                                REVOKED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            IP: {sess.ipAddress || '127.0.0.1'} • {sess.location || 'Local Workspace'} • Last active:{' '}
                            {sess.lastActiveAt ? new Date(sess.lastActiveAt).toLocaleString() : 'Just now'}
                          </p>
                        </div>
                        {!sess.isRevoked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() => handleRevokeSession(sess.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-indigo-600" />
                      FIDO2 / WebAuthn Passkeys
                    </h3>
                    <p className="text-xs text-slate-500">
                      Sign in seamlessly using hardware keys, Windows Hello, Touch ID, or Face ID.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Register New Passkey
                  </Button>
                </div>

                <div className="space-y-3">
                  {passkeys.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 text-center">
                      No passkeys registered yet for this account.
                    </div>
                  ) : (
                    passkeys.map((pk) => (
                      <div
                        key={pk.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {pk.deviceName || 'Primary Hardware Key'}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            ID: {pk.credentialId.substring(0, 16)}... • Sign Count: {pk.signCount}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: MCP Governance */}
          {activeTab === 'MCP Governance' && (
            <div className="space-y-6">
              {/* Tool Registry */}
              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-brand-600" />
                      Model Context Protocol (MCP) Tools
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardized MCP tools exposed to AI Copilots, Cursor, Claude, and Multi-Agent runners.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={loadMcpData} leftIcon={<RefreshCw className="w-4 h-4" />}>
                    Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mcpTools.map((tool) => (
                    <div
                      key={tool.name}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                            {tool.name}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                            {tool.source}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{tool.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {tool.destructive ? '⚠️ Destructive Action' : '🛡️ Read / Safe Write'}
                        </span>
                        {tool.requireConfirmation && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold">
                            Requires User Confirmation
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* MCP Servers & External Registrations */}
              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Connected MCP Servers & Transports
                  </h3>
                </div>

                <form onSubmit={handleRegisterMcpServer} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Server Name (e.g. Postgres MCP, GitHub MCP)"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Server URL (e.g. http://localhost:8081/sse)"
                    value={newServerUrl}
                    onChange={(e) => setNewServerUrl(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Connect Server
                  </Button>
                </form>

                <div className="space-y-2 pt-2">
                  {mcpServers.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">
                      No external MCP servers configured. Built-in CRM tools are actively serving requests.
                    </p>
                  ) : (
                    mcpServers.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{s.name}</p>
                          <p className="font-mono text-[11px] text-slate-500">{s.serverUrl}</p>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
                          {s.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* MCP Audit Trail */}
              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Immutable MCP Execution Audit Trail
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500">
                        <th className="pb-2">Timestamp</th>
                        <th className="pb-2">Tool Name</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {mcpAuditLogs.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-4 text-center text-slate-500">
                            No MCP tool executions logged yet today.
                          </td>
                        </tr>
                      ) : (
                        mcpAuditLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="py-2.5 font-mono text-[11px] text-slate-500">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="py-2.5 font-bold font-mono text-brand-600 dark:text-brand-400">
                              {log.toolName}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                  log.status === 'SUCCESS'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-500">{log.executionTimeMs} ms</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: Developer Platform (API Keys & Webhooks) */}
          {activeTab === 'Developer Platform' && (
            <div className="space-y-6">
              {/* API Keys Panel */}
              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-500" />
                      REST API Secret Keys
                    </h3>
                    <p className="text-xs text-slate-500">
                      Authenticate external systems, pipelines, or server scripts with the centralized backend.
                    </p>
                  </div>
                </div>

                {createdRawKey && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                    <p className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Save Your New API Secret
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      This secret will NEVER be displayed again. Store it securely in your environment variables.
                    </p>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border font-mono font-bold text-brand-600 select-all">
                      {createdRawKey}
                    </div>
                  </div>
                )}

                <form onSubmit={handleCreateApiKey} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Key Label (e.g. CI/CD Integration, Lead Sync Script)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Generate Key
                  </Button>
                </form>

                <div className="space-y-2 pt-2">
                  {apiKeys.map((k) => (
                    <div
                      key={k.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{k.name}</p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {k.keyPrefix}•••••••• • Scopes: {k.scopes} • Limit: {k.rateLimitPerMinute} req/min
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600"
                        onClick={() => handleRevokeApiKey(k.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Webhooks Panel */}
              <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <WebhookIcon className="w-5 h-5 text-indigo-500" />
                      Webhook Subscriptions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Receive signed HTTP POST events in real-time when deals close, leads are created, or tasks complete.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateWebhook} className="flex gap-3">
                  <input
                    type="url"
                    placeholder="Payload URL (e.g. https://api.yourdomain.com/webhooks/crm)"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Add Webhook
                  </Button>
                </form>

                <div className="space-y-2 pt-2">
                  {webhooks.map((wh) => (
                    <div
                      key={wh.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-slate-900 dark:text-slate-100 font-mono">{wh.url}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Secret: {wh.secret.substring(0, 10)}••••••••</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Play className="w-3.5 h-3.5" />}
                          onClick={() => handleTestWebhook(wh.id)}
                        >
                          Ping Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: Organization */}
          {activeTab === 'Organization' && (
            <Card className="space-y-4 p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
                Organization Profile
              </h3>
              <Input label="Organization Name" defaultValue={currentOrganization.name} />
              <Input label="Domain Subdomain" defaultValue={`${currentOrganization.slug}.nexuscrm.io`} disabled />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Default Currency" defaultValue="USD ($)" />
                <Input label="Timezone" defaultValue="America/New_York (EST)" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </Card>
          )}

          {/* TAB 5: Users & Team */}
          {activeTab === 'Users & Team' && (
            <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Members & Seat Licenses</h3>
                <Button variant="primary" size="sm">Invite Member</Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Alex Vance</p>
                    <p className="text-xs text-slate-500">admin@acme.com • Admin Role</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded">ACTIVE</span>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 6: Roles & RBAC */}
          {activeTab === 'Roles & RBAC' && (
            <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
                Role-Based Access Control Policies
              </h3>
              <p className="text-xs text-slate-500">
                Standard roles: ADMIN (Full Control), MANAGER (Team Pipeline), SALES_AGENT (Assigned Records).
              </p>
            </Card>
          )}

          {/* TAB 7: Billing & Plan */}
          {activeTab === 'Billing & Plan' && (
            <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Subscription & Entitlements</h3>
                  <p className="text-xs text-slate-500">Currently on Nexus Enterprise CRM OS Tier</p>
                </div>
                <span className="px-3 py-1 text-xs font-extrabold bg-brand-50 text-brand-700 rounded-full border border-brand-200 uppercase">
                  ENTERPRISE
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between"><span>User Seats Used:</span><span className="font-bold">5 / 50</span></div>
                <div className="flex justify-between"><span>MCP Tool Integrations:</span><span className="font-bold">Active</span></div>
                <div className="flex justify-between"><span>AI Copilot Tokens:</span><span className="font-bold">Unlimited</span></div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
