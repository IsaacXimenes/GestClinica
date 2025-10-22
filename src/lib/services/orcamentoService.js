import api from './api';

export const getOrcamentos = async () => {
  const res = await api.get('/orcamentos');
  return res.data;
};

export const createOrcamento = async (orcamento) => {
  const res = await api.post('/orcamentos', orcamento);
  return res.data;
};
