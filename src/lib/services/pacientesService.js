import api from './api';

export const getPacientes = async () => {
  const res = await api.get('/pacientes');
  return res.data;
};

export const createPaciente = async (paciente) => {
  const res = await api.post('/pacientes', paciente);
  return res.data;
};
