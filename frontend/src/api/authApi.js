import axiosClient from './axiosClient';

export const authApi = {
  login: (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },

  register: (fullName, email, password, confirmPassword) => {
    return axiosClient.post('/auth/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });
  },

  getMe: () => {
    return axiosClient.get('/auth/me');
  },
};
