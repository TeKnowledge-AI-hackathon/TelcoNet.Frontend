import apiClient from './apiClient';

export const auditService = {
  getAuditLogs: async (page = 1, pageSize = 50) => {
    return apiClient(`/AuditLogs?page=${page}&pageSize=${pageSize}`);
  }
};
