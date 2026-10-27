import axiosClient from './axiosClient';

export const projectApi = {
  getProjects: (status, search) => {
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    return axiosClient.get('/projects', { params });
  },

  getProject: (id) => {
    return axiosClient.get(`/projects/${id}`);
  },

  createProject: (data) => {
    return axiosClient.post('/projects', data);
  },

  updateProject: (id, data) => {
    return axiosClient.put(`/projects/${id}`, data);
  },

  updateStatus: (id, status) => {
    return axiosClient.patch(`/projects/${id}/status`, { status });
  },

  deleteProject: (id) => {
    return axiosClient.delete(`/projects/${id}`);
  },

  getStats: () => {
    return axiosClient.get('/projects/stats');
  },

  getAdminUsers: () => {
    return axiosClient.get('/admin/users');
  },
};
