import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-200 p-4 h-screen">
      <nav className="flex flex-col gap-2">
        <Link to="/">Dashboard</Link>
        <Link to="/cadastro-pacientes">Pacientes</Link>
        <Link to="/orcamentos">Orçamentos</Link>
        <Link to="/estoque">Estoque</Link>
        <Link to="/agenda">Agenda</Link>
      </nav>
    </aside>
  );
}
