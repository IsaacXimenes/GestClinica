import React, { useState, useEffect, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Clock, User, Phone, Package, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Bell, Search, Filter } from 'lucide-react';
import { OrcamentosContext } from '../App'; // Importar o contexto

const GestaoAgenda = ({ onBack, user }) => {
  const { orcamentosAprovados, setOrcamentosAprovados } = useContext(OrcamentosContext); // Usar o contexto
  const [agendamentos, setAgendamentos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('calendario');
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);
  const [showEditAgendamento, setShowEditAgendamento] = useState(false);
  const [showAgendarOrcamento, setShowAgendarOrcamento] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificacoes, setNotificacoes] = useState([]);

  // Formulário de novo agendamento
  const [novoAgendamento, setNovoAgendamento] = useState({
    paciente: '',
    telefone: '',
    procedimento: '',
    data: '',
    horario: '',
    observacoes: ''
  });

  // Formulário de agendamento a partir de orçamento
  const [agendamentoOrcamento, setAgendamentoOrcamento] = useState({
    data: '',
    horario: '',
    observacoes: ''
  });

  // Dados mockados
  const mockData = {
    agendamentos: [],
    pacientes: [
      { id: 1, nome: 'Maria Silva Santos', telefone: '(11) 99999-1234' },
      { id: 2, nome: 'Ana Costa Oliveira', telefone: '(11) 88888-5678' }
    ],
    procedimentos: [
      { nome: 'Harmonização Facial', duracao: 60, valor: 1500.00 },
      { nome: 'Preenchimento Labial', duracao: 30, valor: 800.00 }
    ],
    horarios: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  };

  // Verificar conflitos de horários
  const checkHorarioConflito = (data, horario, duracao, idExcluir = null) => {
    const agendamentosDia = agendamentos.filter(a => a.data === data && a.id !== idExcluir);
    const inicio = parseInt(horario.replace(':', ''));
    const fim = inicio + (duracao / 60) * 100;
    return agendamentosDia.some(a => {
      const inicioAgendamento = parseInt(a.horario.replace(':', ''));
      const fimAgendamento = inicioAgendamento + (a.duracao / 60) * 100;
      return (inicio < fimAgendamento && fim > inicioAgendamento);
    });
  };

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  // Filtrar agendamentos por data
  const getAgendamentosPorData = (data) => {
    return agendamentos.filter(agendamento => agendamento.data === data);
  };

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const matchStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus;
    const matchSearch = agendamento.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       agendamento.procedimento.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Verificar notificações
  useEffect(() => {
    const verificarNotificacoes = () => {
      const agora = new Date();
      const novasNotificacoes = [];
      agendamentos.forEach(agendamento => {
        if (agendamento.status === 'Agendado') {
          const dataHorario = new Date(`${agendamento.data}T${agendamento.horario}`);
          const tempoRestante = dataHorario.getTime() - agora.getTime();
          const horasRestantes = tempoRestante / (1000 * 60 * 60);
          const minutosRestantes = tempoRestante / (1000 * 60);
          if (horasRestantes <= 2 && horasRestantes > 1.75) {
            novasNotificacoes.push({
              id: `prep-2h-${agendamento.id}`,
              tipo: 'preparo-2h',
              prioridade: 'alta',
              agendamento,
              mensagem: `⚠️ URGENTE: Preparar materiais para ${agendamento.paciente} - ${agendamento.procedimento} às ${agendamento.horario}`,
              tempoRestante: `${Math.floor(horasRestantes)}h ${Math.floor((horasRestantes % 1) * 60)}min`
            });
          }
          if (horasRestantes <= 1.75 && horasRestantes > 0 && minutosRestantes % 15 < 1) {
            novasNotificacoes.push({
              id: `prep-15min-${agendamento.id}-${Math.floor(minutosRestantes / 15)}`,
              tipo: 'preparo-15min',
              prioridade: 'critica',
              agendamento,
              mensagem: `🚨 CRÍTICO: Materiais para ${agendamento.paciente} devem estar prontos! Procedimento em ${Math.floor(minutosRestantes)} minutos`,
              tempoRestante: `${Math.floor(minutosRestantes)} min`
            });
          }
          if (minutosRestantes <= 30 && minutosRestantes > 25) {
            novasNotificacoes.push({
              id: `prep-30min-${agendamento.id}`,
              tipo: 'preparo-30min',
              prioridade: 'critica',
              agendamento,
              mensagem: `🔥 ÚLTIMO AVISO: ${agendamento.paciente} chega em 30 minutos! Verificar se todos os materiais estão prontos`,
              tempoRestante: '30 min'
            });
          }
          if (minutosRestantes <= 5 && minutosRestantes > 0) {
            novasNotificacoes.push({
              id: `chegada-${agendamento.id}`,
              tipo: 'chegada',
              prioridade: 'info',
              agendamento,
              mensagem: `👤 ${agendamento.paciente} deve estar chegando para ${agendamento.procedimento}`,
              tempoRestante: 'Agora'
            });
          }
        }
        if (agendamento.status === 'Aguardando Separação Materiais') {
          const dataHorario = new Date(`${agendamento.data}T${agendamento.horario}`);
          const tempoRestante = dataHorario.getTime() - agora.getTime();
          const horasRestantes = tempoRestante / (1000 * 60 * 60);
          if (horasRestantes <= 24 && horasRestantes > 0) {
            novasNotificacoes.push({
              id: `separacao-${agendamento.id}`,
              tipo: 'separacao-pendente',
              prioridade: 'media',
              agendamento,
              mensagem: `📦 Materiais pendentes: ${agendamento.paciente} - ${agendamento.procedimento} (${new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')} às ${agendamento.horario})`,
              tempoRestante: `${Math.floor(horasRestantes)}h`
            });
          }
        }
      });
      const notificacoesUnicas = novasNotificacoes.filter((notificacao, index, self) => 
        index === self.findIndex(n => n.id === notificacao.id)
      );
      setNotificacoes(notificacoesUnicas);
    };
    verificarNotificacoes();
    const interval = setInterval(verificarNotificacoes, 60 * 1000);
    return () => clearInterval(interval);
  }, [agendamentos]);

  const handleAgendarOrcamento = (orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setAgendamentoOrcamento({
      data: '',
      horario: '',
      observacoes: orcamento.observacoes || ''
    });
    setShowAgendarOrcamento(true);
  };

  const handleConfirmarAgendamentoOrcamento = () => {
    if (!agendamentoOrcamento.data || !agendamentoOrcamento.horario) {
      alert('Por favor, preencha a data e horário.');
      return;
    }
    const procedimentoInfo = mockData.procedimentos.find(p => p.nome === orcamentoSelecionado.procedimento);
    if (checkHorarioConflito(agendamentoOrcamento.data, agendamentoOrcamento.horario, procedimentoInfo?.duracao || 60)) {
      alert('Horário já ocupado! Escolha outro horário.');
      return;
    }
    const novoId = agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1;
    const agendamento = {
      id: novoId,
      paciente: orcamentoSelecionado.paciente,
      telefone: orcamentoSelecionado.telefone,
      procedimento: orcamentoSelecionado.procedimento || 'Procedimento não especificado',
      data: agendamentoOrcamento.data,
      horario: agendamentoOrcamento.horario,
      duracao: procedimentoInfo?.duracao || 60,
      status: 'Agendado',
      valor: orcamentoSelecionado.total,
      materiais: orcamentoSelecionado.materiais || [],
      observacoes: agendamentoOrcamento.observacoes,
      orcamentoId: orcamentoSelecionado.id
    };
    setAgendamentos([...agendamentos, agendamento]);
    setOrcamentosAprovados(orcamentosAprovados.map(orc => 
      orc.id === orcamentoSelecionado.id ? { ...orc, agendado: true } : orc
    ));
    setShowAgendarOrcamento(false);
    setOrcamentoSelecionado(null);
    setAgendamentoOrcamento({ data: '', horario: '', observacoes: '' });
  };

  const handleNovoAgendamento = () => {
    if (!novoAgendamento.paciente || !novoAgendamento.procedimento || !novoAgendamento.data || !novoAgendamento.horario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const procedimentoInfo = mockData.procedimentos.find(p => p.nome === novoAgendamento.procedimento);
    if (checkHorarioConflito(novoAgendamento.data, novoAgendamento.horario, procedimentoInfo?.duracao || 60)) {
      alert('Horário já ocupado! Escolha outro horário.');
      return;
    }
    const novoId = agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1;
    const agendamento = {
      id: novoId,
      paciente: novoAgendamento.paciente,
      telefone: novoAgendamento.telefone,
      procedimento: novoAgendamento.procedimento,
      data: novoAgendamento.data,
      horario: novoAgendamento.horario,
      duracao: procedimentoInfo?.duracao || 60,
      status: 'Agendado',
      valor: procedimentoInfo?.valor || 0,
      materiais: [],
      observacoes: novoAgendamento.observacoes,
      orcamentoId: null
    };
    setAgendamentos([...agendamentos, agendamento]);
    setShowNovoAgendamento(false);
    setNovoAgendamento({
      paciente: '',
      telefone: '',
      procedimento: '',
      data: '',
      horario: '',
      observacoes: ''
    });
  };

  const handleEditarAgendamento = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setShowEditAgendamento(true);
  };

  const handleExcluirAgendamento = (id) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      setAgendamentos(agendamentos.filter(a => a.id !== id));
    }
  };

  const handleAlterarStatus = (id, novoStatus) => {
    setAgendamentos(agendamentos.map(a => 
      a.id === id ? { ...a, status: novoStatus } : a
    ));
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'critica': return 'border-red-500 bg-red-50';
      case 'alta': return 'border-orange-500 bg-orange-50';
      case 'media': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityTextColor = (prioridade) => {
    switch (prioridade) {
      case 'critica': return 'text-red-800';
      case 'alta': return 'text-orange-800';
      case 'media': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };

  const getPriorityIcon = (tipo) => {
    switch (tipo) {
      case 'preparo-2h':
      case 'preparo-15min':
      case 'preparo-30min':
        return <Package className="h-5 w-5" />;
      case 'chegada':
        return <User className="h-5 w-5" />;
      case 'separacao-pendente':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Materiais Separados': return 'bg-green-100 text-green-800';
      case 'Aguardando Separação Materiais': return 'bg-yellow-100 text-yellow-800';
      case 'Concluído': return 'bg-gray-100 text-gray-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Gestão de Agenda</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {notificacoes.length > 0 && (
                <div className="relative">
                  <Bell className="h-5 w-5 text-red-500" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificacoes.length}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <div className="text-gray-900 font-medium">{user.nome}</div>
                <div className="text-gray-500 text-xs">{user.role}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notificações */}
        {notificacoes.length > 0 && (
          <div className="mb-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Central de Notificações ({notificacoes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notificacoes
                    .sort((a, b) => {
                      const prioridades = { 'critica': 4, 'alta': 3, 'media': 2, 'info': 1 };
                      return prioridades[b.prioridade] - prioridades[a.prioridade];
                    })
                    .map(notificacao => (
                      <div 
                        key={notificacao.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border-2 ${getPriorityColor(notificacao.prioridade)} ${
                          notificacao.prioridade === 'critica' ? 'animate-pulse' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={getPriorityTextColor(notificacao.prioridade)}>
                            {getPriorityIcon(notificacao.tipo)}
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${getPriorityTextColor(notificacao.prioridade)}`}>
                              {notificacao.mensagem}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Tempo restante: {notificacao.tempoRestante}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {notificacao.tipo.includes('preparo') && (
                            <Button 
                              size="sm" 
                              onClick={() => handleAlterarStatus(notificacao.agendamento.id, 'Materiais Separados')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              ✓ Materiais Prontos
                            </Button>
                          )}
                          {notificacao.tipo === 'separacao-pendente' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAlterarStatus(notificacao.agendamento.id, 'Agendado')}
                            >
                              📦 Separar Agora
                            </Button>
                          )}
                          {notificacao.tipo === 'chegada' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleAlterarStatus(notificacao.agendamento.id, 'Concluído')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              ✓ Paciente Chegou
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controles */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setShowNovoAgendamento(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Agendamento</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'calendario' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendario')}
              >
                Calendário
              </Button>
              <Button 
                variant={viewMode === 'lista' ? 'default' : 'outline'}
                onClick={() => setViewMode('lista')}
              >
                Lista
              </Button>
              <Button 
                variant={viewMode === 'orcamentos' ? 'default' : 'outline'}
                onClick={() => setViewMode('orcamentos')}
              >
                Orçamentos Aprovados ({orcamentosAprovados.filter(o => !o.agendado).length})
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar paciente ou procedimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Agendado">Agendado</SelectItem>
                <SelectItem value="Materiais Separados">Materiais Separados</SelectItem>
                <SelectItem value="Aguardando Separação Materiais">Aguardando Separação</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Visualização do Calendário */}
        {viewMode === 'calendario' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendário */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{monthNames[today.getMonth()]} {today.getFullYear()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const agendamentosDay = getAgendamentosPorData(dateStr);
                      const isToday = dateStr === today.toISOString().split('T')[0];
                      const isCurrentMonth = day.getMonth() === today.getMonth();
                      
                      return (
                        <div
                          key={index}
                          className={`p-2 min-h-[80px] border rounded cursor-pointer hover:bg-gray-50 ${
                            isToday ? 'bg-blue-50 border-blue-200' : ''
                          } ${!isCurrentMonth ? 'text-gray-300' : ''}`}
                          onClick={() => setSelectedDate(dateStr)}
                        >
                          <div className="text-sm font-medium">{day.getDate()}</div>
                          <div className="space-y-1 mt-1">
                            {agendamentosDay.slice(0, 2).map(agendamento => (
                              <div
                                key={agendamento.id}
                                className={`text-xs p-1 rounded truncate ${getStatusColor(agendamento.status)}`}
                              >
                                {agendamento.horario} - {agendamento.paciente}
                              </div>
                            ))}
                            {agendamentosDay.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{agendamentosDay.length - 2} mais
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agendamentos do Dia Selecionado */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Agendamentos - {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getAgendamentosPorData(selectedDate).length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhum agendamento para este dia</p>
                    ) : (
                      getAgendamentosPorData(selectedDate).map(agendamento => (
                        <div key={agendamento.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{agendamento.horario}</span>
                            </div>
                            <Badge className={getStatusColor(agendamento.status)}>
                              {agendamento.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{agendamento.paciente}</span>
                            </div>
                            <div className="text-sm text-gray-600">{agendamento.procedimento}</div>
                            <div className="text-sm text-gray-600">R$ {agendamento.valor.toFixed(2)}</div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => handleEditarAgendamento(agendamento)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleExcluirAgendamento(agendamento.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            {agendamento.status === 'Agendado' && (
                              <Button size="sm" onClick={() => handleAlterarStatus(agendamento.id, 'Materiais Separados')}>
                                Separar Materiais
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Visualização em Lista */}
        {viewMode === 'lista' && (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Agendamentos</CardTitle>
              <CardDescription>
                {agendamentosFiltrados.length} agendamento(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentosFiltrados.map(agendamento => (
                  <div key={agendamento.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{agendamento.paciente}</h3>
                          <p className="text-sm text-gray-600">{agendamento.telefone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{agendamento.procedimento}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {agendamento.horario}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(agendamento.status)}>
                          {agendamento.status}
                        </Badge>
                        <span className="font-medium">R$ {agendamento.valor.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {agendamento.materiais.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Materiais necessários:</p>
                        <div className="flex flex-wrap gap-1">
                          {agendamento.materiais.map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {agendamento.observacoes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">{agendamento.observacoes}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditarAgendamento(agendamento)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleExcluirAgendamento(agendamento.id)}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                      {agendamento.status === 'Agendado' && (
                        <Button size="sm" onClick={() => handleAlterarStatus(agendamento.id, 'Materiais Separados')}>
                          <Package className="h-3 w-3 mr-1" />
                          Separar Materiais
                        </Button>
                      )}
                      {agendamento.status === 'Materiais Separados' && (
                        <Button size="sm" onClick={() => handleAlterarStatus(agendamento.id, 'Concluído')}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visualização de Orçamentos Aprovados */}
        {viewMode === 'orcamentos' && (
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos Aprovados Pendentes de Agendamento</CardTitle>
              <CardDescription>
                {orcamentosAprovados.filter(o => !o.agendado).length} orçamento(s) aguardando agendamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamentosAprovados.filter(o => !o.agendado).map(orcamento => (
                  <div key={orcamento.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-green-800">{orcamento.paciente}</h3>
                          <p className="text-sm text-gray-600">{orcamento.telefone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{orcamento.chave}</p>
                          <p className="text-sm text-gray-600">
                            Aprovado em {orcamento.dataAprovacao}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">
                          Aprovado
                        </Badge>
                        <span className="font-medium">R$ {orcamento.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {orcamento.materiais && orcamento.materiais.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Materiais necessários:</p>
                        <div className="flex flex-wrap gap-1">
                          {orcamento.materiais.map((material, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {orcamento.observacoes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">{orcamento.observacoes}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Orçamento: {orcamento.id}
                      </div>
                      <Button 
                        onClick={() => handleAgendarOrcamento(orcamento)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Agendar Procedimento
                      </Button>
                    </div>
                  </div>
                ))}
                
                {orcamentosAprovados.filter(o => !o.agendado).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Todos os orçamentos foram agendados!
                    </h3>
                    <p className="text-gray-600">
                      Não há orçamentos aprovados pendentes de agendamento.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog - Agendar Orçamento */}
        <Dialog open={showAgendarOrcamento} onOpenChange={setShowAgendarOrcamento}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar Procedimento</DialogTitle>
              <DialogDescription>
                Agendando: {orcamentoSelecionado?.procedimento || 'Procedimento'} para {orcamentoSelecionado?.paciente}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data-orcamento">Data *</Label>
                  <Input
                    id="data-orcamento"
                    type="date"
                    value={agendamentoOrcamento.data}
                    onChange={(e) => setAgendamentoOrcamento({...agendamentoOrcamento, data: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="horario-orcamento">Horário *</Label>
                  <Select value={agendamentoOrcamento.horario} onValueChange={(value) => setAgendamentoOrcamento({...agendamentoOrcamento, horario: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockData.horarios.map(horario => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes-orcamento">Observações</Label>
                <Textarea
                  id="observacoes-orcamento"
                  value={agendamentoOrcamento.observacoes}
                  onChange={(e) => setAgendamentoOrcamento({...agendamentoOrcamento, observacoes: e.target.value})}
                  placeholder="Observações sobre o procedimento..."
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Procedimento:</span>
                    <span className="font-medium">{orcamentoSelecionado?.procedimento || 'Não especificado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor:</span>
                    <span className="font-medium">R$ {orcamentoSelecionado?.total.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orçamento:</span>
                    <span className="font-medium">{orcamentoSelecionado?.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAgendarOrcamento(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmarAgendamentoOrcamento}>
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog - Novo Agendamento */}
        <Dialog open={showNovoAgendamento} onOpenChange={setShowNovoAgendamento}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo agendamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paciente">Paciente *</Label>
                <Select value={novoAgendamento.paciente} onValueChange={(value) => {
                  const paciente = mockData.pacientes.find(p => p.nome === value);
                  setNovoAgendamento({
                    ...novoAgendamento,
                    paciente: value,
                    telefone: paciente?.telefone || ''
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.pacientes.map(paciente => (
                      <SelectItem key={paciente.id} value={paciente.nome}>
                        {paciente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoAgendamento.telefone}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="procedimento">Procedimento *</Label>
                <Select value={novoAgendamento.procedimento} onValueChange={(value) => setNovoAgendamento({...novoAgendamento, procedimento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o procedimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.procedimentos.map(proc => (
                      <SelectItem key={proc.nome} value={proc.nome}>
                        {proc.nome} - R$ {proc.valor.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novoAgendamento.data}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, data: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="horario">Horário *</Label>
                  <Select value={novoAgendamento.horario} onValueChange={(value) => setNovoAgendamento({...novoAgendamento, horario: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockData.horarios.map(horario => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={novoAgendamento.observacoes}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, observacoes: e.target.value})}
                  placeholder="Observações sobre o procedimento..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNovoAgendamento(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleNovoAgendamento}>
                  Agendar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default GestaoAgenda;