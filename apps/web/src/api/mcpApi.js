import { apiClient } from './client';

export const mcpApi = {
  listTools: () => apiClient.get('/mcp/tools'),
  executeTool: (data) => apiClient.post('/mcp/execute', data),
  getServers: () => apiClient.get('/mcp/servers'),
  registerServer: (data) => apiClient.post('/mcp/servers', data),
  deleteServer: (id) => apiClient.delete(`/mcp/servers/${id}`),
  getAuditLogs: (params) => apiClient.get('/mcp/audit', { params }),
  getPermissions: () => apiClient.get('/mcp/permissions'),
  savePermission: (data) => apiClient.post('/mcp/permissions', data),
};
