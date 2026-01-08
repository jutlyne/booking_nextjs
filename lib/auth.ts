import { apiFetch } from './api';

export type User = {
  id: string;
  email: string;
  name: string;
};

export const authApi = {
  me: () => apiFetch<User>('/auth/profile'),

  login: (data: { email: string; password: string }) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    }),
};
