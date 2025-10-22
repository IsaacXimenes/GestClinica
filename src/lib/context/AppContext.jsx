import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [agenda, setAgenda] = useState([]);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      pacientes,
      setPacientes,
      orcamentos,
      setOrcamentos,
      agenda,
      setAgenda
    }}>
      {children}
    </AppContext.Provider>
  );
};
