import api from './api';

export const commentService = {
  async addComment(taskId, text) {
    const res = await api.post(`/tasks/${taskId}/comments`, { text });
    return res.data;
  },

  async getComments(taskId) {
    const res = await api.get(`/tasks/${taskId}/comments`);
    return res.data;
  },

  async deleteComment(taskId, commentId) {
    const res = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return res.data;
  },
};
