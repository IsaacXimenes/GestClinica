import api from './api';

export const getAgenda = async () => {
  const res = await api.get('/agenda');
  return res.data;
};
