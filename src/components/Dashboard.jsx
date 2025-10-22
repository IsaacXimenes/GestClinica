import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { LogOut, User, Calendar, DollarSign, Package, Users, AlertTriangle, Eye } from 'lucide-react';

const Dashboard = ({ user, setActiveComponent, onLogout }) => {
  // Dados mockados para o Dashboard de métricas
  const mockData = {
    novosPacientes: [
      { id: 1, nome: "Ana Souza" },
      { id: 2, nome: "Bruno Costa" },
      { id: 3, nome: "Carla Dias" },
    ],
    procedimentosSemana: [
      { id: 101, paciente: "Ana Souza", data: "Segunda, 10:00" },
      { id: 102, paciente: "Bruno Costa", data: "Terça, 14:00" },
    ],
    baixoEstoque: [
      { id: 201, item: "Ácido Hialurônico", quantidade: 3 },
      { id: 202, item: "Botox", quantidade: 5 },
    ],
    faturamentoMes: 15420.00,
    faturamentoMesAnterior: 14600.00,
    agendaProximosDias: [
      { dia: "Segunda", procedimentos: 1 },
      { dia: "Terça", procedimentos: 1 },
    ]
  };

  const percentualFaturamento = ((mockData.faturamentoMes - mockData.faturamentoMesAnterior) / mockData.faturamentoMesAnterior) * 100;

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-md p-6 flex justify-between items-center border-b-2 border-blue-300">
        <div className="flex items-center space-x-4">
          <span className="text-2xl text-blue-600 font-bold">CG</span>
          <span className="text-xl font-semibold text-gray-800">Clínica Gest</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center">
              <User className="h-6 w-6 mr-2 text-gray-700" />
              <span className="font-medium text-gray-800">Dr. João Silva</span>
            </div>
            <span className="text-sm text-gray-600">Administrador</span>
          </div>
          <Button variant="outline" onClick={onLogout} size="sm" className="text-blue-700 border-blue-700 hover:bg-blue-100">
            <LogOut className="h-5 w-5 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 ml-4 mr-4">
        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50" onClick={() => setActiveComponent("criacaoOrcamentos")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Criação de Orçamentos</CardTitle>
                <DollarSign className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-extrabold text-gray-800">Gerar Orçamentos</div>
                <p className="text-sm text-gray-600">Crie e gerencie orçamentos para procedimentos.</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50" onClick={() => setActiveComponent("entradaEstoque")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Entrada de Estoque</CardTitle>
                <Package className="h-6 w-6 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-extrabold text-gray-800">Controle de Materiais</div>
                <p className="text-sm text-gray-600">Registre entradas e saídas de produtos.</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50" onClick={() => setActiveComponent("cadastroPacientes")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Cadastro de Pacientes</CardTitle>
                <Users className="h-6 w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-extrabold text-gray-800">Gerenciar Pacientes</div>
                <p className="text-sm text-gray-600">Adicione, edite e visualize pacientes.</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50" onClick={() => setActiveComponent("gestaoAgenda")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Gestão de Agenda</CardTitle>
                <Calendar className="h-6 w-6 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-extrabold text-gray-800">Organizar Consultas</div>
                <p className="text-sm text-gray-600">Agendamentos, horários e notificações.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fadeIn border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 shadow-lg hover:shadow-xl" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Faturamento do Mês</CardTitle>
              <DollarSign className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-gray-800">{formatarValor(mockData.faturamentoMes)}</div>
              <p className="text-sm text-gray-600">{percentualFaturamento >= 0 ? '+' : ''}{percentualFaturamento.toFixed(1)}% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 shadow-lg hover:shadow-xl" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Baixo Estoque</CardTitle>
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-gray-800">{mockData.baixoEstoque.length}</div>
              <p className="text-sm text-gray-600">Itens que precisam de reposição</p>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 shadow-lg hover:shadow-xl" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Novos Pacientes</CardTitle>
              <Users className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-gray-800">{mockData.novosPacientes.length}</div>
              <p className="text-sm text-gray-600">+{mockData.novosPacientes.length} esta semana</p>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 shadow-lg hover:shadow-xl" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Procedimentos da Semana</CardTitle>
              <Calendar className="h-6 w-6 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-gray-800">{mockData.procedimentosSemana.length}</div>
              <p className="text-sm text-gray-600">Próximos 7 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Visão Geral da Agenda */}
        <div>
          <Card className="animate-fadeIn border border-gray-300 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 shadow-lg" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">Visão Geral da Agenda</CardTitle>
              <CardDescription className="text-sm text-gray-600">Próximos procedimentos agendados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.agendaProximosDias.map((item, index) => (
                <div key={index} className="animate-slideUp flex items-center justify-between p-3 border rounded-lg bg-gray-50 transition-all duration-300 hover:opacity-90 hover:shadow-md" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="font-medium text-gray-800">{item.dia}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.procedimentos} procedimento{item.procedimentos > 1 ? 's' : ''}</span>
                    <Button variant="outline" size="sm" className="text-blue-700 border-blue-700 hover:bg-blue-100">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;