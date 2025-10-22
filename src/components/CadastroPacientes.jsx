import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Edit, Eye, Calendar, Phone, Mail, User, MapPin, FileText, Save, X, Users, Filter, Download, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useContext } from 'react';
import { PacientesContext } from '../App';

const CadastroPacientes = ({ onBack, user }) => {
  const { pacientes, setPacientes } = useContext(PacientesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [notification, setNotification] = useState(null);
  const [logAlteracoes, setLogAlteracoes] = useState([
    {
      id: 1,
      tipo: 'paciente_criado',
      descricao: 'Paciente "Maria Silva" foi cadastrado',
      usuario: 'Dr. João Silva',
      data: '15/01/2024 14:30'
    },
    {
      id: 2,
      tipo: 'paciente_editado',
      descricao: 'Dados do paciente "Ana Costa" foram atualizados',
      usuario: 'Maria Santos',
      data: '14/01/2024 16:45'
    }
  ]);

  const [newPatient, setNewPatient] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    profissao: '',
    observacoes: '',
    como_conheceu: '',
    status: 'Ativo'
  });

  // Sincronizar pacientes do Firestore
  useEffect(() => {
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
  }, [setPacientes]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (showAddPatient) {
          handleAddPatient();
        }
      }
      if (event.ctrlKey && event.key === 'Escape') {
        event.preventDefault();
        setShowAddPatient(false);
        setShowPatientDetails(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddPatient]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddPatient = async () => {
    if (!newPatient.nome || !newPatient.telefone) {
      showNotification('Preencha pelo menos o nome e telefone!', 'error');
      return;
    }

    // Verificar CPF duplicado no Firestore
    const cpfExists = pacientes.some(p => p.cpf === newPatient.cpf && p.id !== newPatient.id);
    if (newPatient.cpf && cpfExists) {
      showNotification('CPF já cadastrado!', 'error');
      return;
    }

    const novoPaciente = {
      ...newPatient,
      data_cadastro: new Date().toISOString().split('T')[0],
      ultimo_procedimento: null,
      total_procedimentos: 0,
      valor_total_gasto: 0.00
    };

    await addDoc(collection(db, 'pacientes'), novoPaciente);

    // Registrar no log
    setLogAlteracoes(prev => [...prev, {
      id: prev.length + 1,
      tipo: 'paciente_criado',
      descricao: `Paciente "${newPatient.nome}" foi cadastrado`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    }]);

    // Limpar formulário
    setNewPatient({
      nome: '',
      cpf: '',
      data_nascimento: '',
      telefone: '',
      email: '',
      endereco: '',
      cep: '',
      cidade: '',
      estado: '',
      profissao: '',
      observacoes: '',
      como_conheceu: '',
      status: 'Ativo'
    });

    setShowAddPatient(false);
    showNotification('Paciente cadastrado com sucesso!');
  };

  const handleViewPatient = (paciente) => {
    setSelectedPatient(paciente);
    setShowPatientDetails(true);
  };

  const getFormattedDateTime = () => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${day}_${month}_${year} - ${hours}_${minutes}`;
    } catch {
      return '01_01_2000 - 00_00';
    }
  };

  const formatDateToBrazilian = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return '-';
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  };

  const convertToCSV = (objArray) => {
    if (!objArray || !Array.isArray(objArray) || objArray.length === 0) {
      return '\uFEFF';
    }

    let str = '\uFEFF'; // BOM para UTF-8
    let row = '';

    // Cabeçalhos
    const headers = Object.keys(objArray[0]);
    headers.forEach((header, index) => {
      if (index > 0) row += ';';
      row += `"${header.replace(/"/g, '""')}"`;
    });
    str += row + '\r\n';

    // Linhas de dados
    objArray.forEach(item => {
      let line = '';
      headers.forEach((header, index) => {
        if (index > 0) line += ';';
        let value = item[header] !== null && item[header] !== undefined ? item[header].toString() : '-';
        if (header === 'CPF') {
          value = `"=""${value.replace(/"/g, '""')}"""`;
        } else {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        line += value;
      });
      str += line + '\r\n';
    });

    return str;
  };

  const exportData = () => {
    const dataToExport = filteredPatients.map(p => ({
      'ID': p.id || '-',
      'Nome': p.nome || '-',
      'CPF': p.cpf || '-',
      'Data Nascimento': formatDateToBrazilian(p.data_nascimento),
      'Telefone': p.telefone || '-',
      'Email': p.email || '-',
      'Endereço': p.endereco || '-',
      'CEP': p.cep || '-',
      'Cidade': p.cidade || '-',
      'Estado': p.estado || '-',
      'Profissão': p.profissao || '-',
      'Como Conheceu': p.como_conheceu || '-',
      'Status': p.status || '-',
      'Data Cadastro': formatDateToBrazilian(p.data_cadastro),
      'Último Procedimento': p.ultimo_procedimento ? formatDateToBrazilian(p.ultimo_procedimento) : '-',
      'Total Procedimentos': Number(p.total_procedimentos || 0).toFixed(0),
      'Valor Total Gasto': `R$ ${Number(p.valor_total_gasto || 0).toFixed(2)}`,
      'Observações': p.observacoes || '-'
    }));

    if (dataToExport.length === 0) {
      showNotification('Nenhum dado de pacientes para exportar.', 'warning');
      setShowExportDialog(false);
      return;
    }

    try {
      const csv = convertToCSV(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `Pacientes - ${getFormattedDateTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('Lista de pacientes exportada com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro ao exportar os dados!', 'error');
      console.error('Erro na exportação:', error);
    }
    setShowExportDialog(false);
  };

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'Inativo':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredPatients = pacientes.filter(paciente => {
    const matchesSearch = paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paciente.telefone.includes(searchTerm) ||
                         paciente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || paciente.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificação */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Cadastro de Pacientes</h1>
              {user.role === 'Administrador' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Log de Alterações</DialogTitle>
                      <DialogDescription>
                        Histórico de todas as alterações nos pacientes
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {logAlteracoes.map((log) => (
                        <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{log.descricao}</p>
                            <p className="text-xs text-gray-500">
                              Por: {log.usuario} • {log.data}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filtros e Ações */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setShowAddPatient(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </div>
          </div>

          {/* Lista de Pacientes */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
              <CardDescription>
                Gerencie os pacientes da clínica ({filteredPatients.length} pacientes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((paciente) => (
                  <div key={paciente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{paciente.nome}</h3>
                            {getStatusBadge(paciente.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {paciente.telefone}
                            </span>
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {paciente.email}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {calcularIdade(paciente.data_nascimento)} anos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-left">
                        <div className="text-lg font-semibold text-gray-900">
                          {paciente.total_procedimentos}
                        </div>
                        <div className="text-sm text-gray-500">Procedimentos</div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-semibold text-gray-900">
                          R$ {paciente.valor_total_gasto.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Total gasto</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {paciente.ultimo_procedimento ? 
                            new Date(paciente.ultimo_procedimento).toLocaleDateString('pt-BR') : 
                            'Nunca'
                          }
                        </div>
                        <div className="text-sm text-gray-500">Último procedimento</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewPatient(paciente)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal Novo Paciente */}
      <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha os dados para cadastrar um novo paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={newPatient.nome}
                  onChange={(e) => setNewPatient({...newPatient, nome: e.target.value})}
                  placeholder="Nome completo do paciente"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={newPatient.cpf}
                  onChange={(e) => setNewPatient({...newPatient, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={newPatient.data_nascimento}
                  onChange={(e) => setNewPatient({...newPatient, data_nascimento: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={newPatient.telefone}
                  onChange={(e) => setNewPatient({...newPatient, telefone: e.target.value})}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={newPatient.endereco}
                onChange={(e) => setNewPatient({...newPatient, endereco: e.target.value})}
                placeholder="Rua, número, bairro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={newPatient.cep}
                  onChange={(e) => setNewPatient({...newPatient, cep: e.target.value})}
                  placeholder="00000-000"
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={newPatient.cidade}
                  onChange={(e) => setNewPatient({...newPatient, cidade: e.target.value})}
                  placeholder="Cidade"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={newPatient.estado}
                onChange={(e) => setNewPatient({...newPatient, estado: e.target.value})}
                placeholder="Estado (Ex: SP)"
              />
            </div>
            <div>
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={newPatient.profissao}
                onChange={(e) => setNewPatient({...newPatient, profissao: e.target.value})}
                placeholder="Ex: Advogado"
              />
            </div>
            <div>
              <Label htmlFor="como_conheceu">Como Conheceu a Clínica?</Label>
              <Input
                id="como_conheceu"
                value={newPatient.como_conheceu}
                onChange={(e) => setNewPatient({...newPatient, como_conheceu: e.target.value})}
                placeholder="Ex: Indicação, Redes Sociais, Google"
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={newPatient.observacoes}
                onChange={(e) => setNewPatient({...newPatient, observacoes: e.target.value})}
                placeholder="Informações adicionais sobre o paciente..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleAddPatient}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Paciente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes do Paciente */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
            <DialogDescription>
              Informações completas sobre {selectedPatient?.nome}
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Nome:</span>
                  <p className="text-gray-900">{selectedPatient.nome}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CPF:</span>
                  <p className="text-gray-900">{selectedPatient.cpf}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Data de Nascimento:</span>
                  <p className="text-gray-900">{new Date(selectedPatient.data_nascimento).toLocaleDateString('pt-BR')} ({calcularIdade(selectedPatient.data_nascimento)} anos)</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Telefone:</span>
                  <p className="text-gray-900">{selectedPatient.telefone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">{selectedPatient.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Endereço:</span>
                  <p className="text-gray-900">{selectedPatient.endereco}, {selectedPatient.cidade} - {selectedPatient.estado}, {selectedPatient.cep}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Profissão:</span>
                  <p className="text-gray-900">{selectedPatient.profissao}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Como Conheceu:</span>
                  <p className="text-gray-900">{selectedPatient.como_conheceu}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Data de Cadastro:</span>
                  <p className="text-gray-900">{new Date(selectedPatient.data_cadastro).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Exportar */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Dados</DialogTitle>
            <DialogDescription>
              Exportar lista de pacientes em formato CSV
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={exportData} className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Exportar Lista de Pacientes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadastroPacientes;