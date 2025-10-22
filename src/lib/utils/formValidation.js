export const isEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const isCPF = (cpf) => /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf);
export const isRequired = (value) => value !== null && value !== undefined && value !== '';
