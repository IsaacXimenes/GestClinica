import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../../componentes/Login';
import Dashboard from '../../componentes/Dashboard';
import CadastroPacientes from '../../componentes/CadastroPacientes';
import CriacaoOrcamentos from '../../componentes/CriacaoOrcamentos';
import EntradaEstoque from '../../componentes/EntradaEstoque';
import GestaoAgenda from '../../componentes/GestaoAgenda';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/cadastro-pacientes" element={<PrivateRoute><CadastroPacientes /></PrivateRoute>} />
        <Route path="/orcamentos" element={<PrivateRoute><CriacaoOrcamentos /></PrivateRoute>} />
        <Route path="/estoque" element={<PrivateRoute><EntradaEstoque /></PrivateRoute>} />
        <Route path="/agenda" element={<PrivateRoute><GestaoAgenda /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
