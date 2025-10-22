import React, { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, collection } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CadastroPacientes from './components/CadastroPacientes';
import CriacaoOrcamentos from './components/CriacaoOrcamentos';
import EntradaEstoque from './components/EntradaEstoque';
import GestaoAgenda from './components/GestaoAgenda';

import './index.css';

// Contexts para compartilhar dados
export const AuthContext = createContext();
export const PacientesContext = createContext();
export const OrcamentosContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("login");
  const [pacientes, setPacientes] = useState([]);
  const [orcamentosAprovados, setOrcamentosAprovados] = useState([]);

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedInUser(user);
      if (user) {
        setActiveComponent("dashboard");
      } else {
        setActiveComponent("login");
      }
    });
    return () => unsubscribe();
  }, []);

  // Carregar pacientes em tempo real
  useEffect(() => {
    if (loggedInUser) {
      const unsubscribe = onSnapshot(collection(db, 'pacientes'), (snapshot) => {
        const pacientesList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setPacientes(pacientesList);
      }, (error) => {
        console.error("Erro ao carregar pacientes:", error);
      });
      return () => unsubscribe();
    }
  }, [loggedInUser]);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    setActiveComponent("dashboard");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveComponent("login");
  };

  const renderComponent = () => {
    if (!loggedInUser) {
      return <Login onLogin={handleLogin} />;
    }

    switch (activeComponent) {
      case "dashboard":
        return <Dashboard user={loggedInUser} setActiveComponent={setActiveComponent} onLogout={handleLogout} />;
      case "cadastroPacientes":
        return (
          <AuthContext.Provider value={{ user: loggedInUser }}>
            <PacientesContext.Provider value={{ pacientes, setPacientes }}>
              <CadastroPacientes onBack={() => setActiveComponent("dashboard")} user={loggedInUser} />
            </PacientesContext.Provider>
          </AuthContext.Provider>
        );
      case "criacaoOrcamentos":
        return (
          <AuthContext.Provider value={{ user: loggedInUser }}>
            <PacientesContext.Provider value={{ pacientes, setPacientes }}>
              <CriacaoOrcamentos onBack={() => setActiveComponent("dashboard")} user={loggedInUser} />
            </PacientesContext.Provider>
          </AuthContext.Provider>
        );
      case "entradaEstoque":
        return <EntradaEstoque onBack={() => setActiveComponent("dashboard")} user={loggedInUser} />;
      case "gestaoAgenda":
        return (
          <AuthContext.Provider value={{ user: loggedInUser }}>
            <OrcamentosContext.Provider value={{ orcamentosAprovados, setOrcamentosAprovados }}>
              <GestaoAgenda onBack={() => setActiveComponent("dashboard")} user={loggedInUser} />
            </OrcamentosContext.Provider>
          </AuthContext.Provider>
        );
      default:
        return <Dashboard user={loggedInUser} setActiveComponent={setActiveComponent} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="App">
      {renderComponent()}
    </div>
  );
}

export default App;