import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  async getTaskById(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  async createTask(data) {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  async updateTask(id, data) {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  async updateStatus(id, status, version) {
    const res = await api.patch(`/tasks/${id}/status`, { status, version });
    return res.data;
  },

  async updateAssignee(id, assignedTo, version) {
    const res = await api.patch(`/tasks/${id}/assign`, { assignedTo, version });
    return res.data;
  },

  async updatePriority(id, priority, version) {
    const res = await api.patch(`/tasks/${id}/priority`, { priority, version });
    return res.data;
  },

  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  async getDashboardStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  async getActivities(params = {}) {
    const res = await api.get('/dashboard/activities', { params });
    return res.data;
  },

  async getAdminStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getAdminUsers() {
    const res = await api.get('/admin/users');
    return res.data;
  },

  async deleteUser(userId) {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },
};
