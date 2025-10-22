import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Plus, Search, ShoppingCart, Calculator, User, Phone, Mail, Package, Trash2, Edit, Save, X, DollarSign, CreditCard, Receipt, History, FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { OrcamentosContext, PacientesContext } from '../App'; // Importar os contextos

const CriacaoOrcamentos = ({ onBack, user }) => {
  const { orcamentosAprovados, setOrcamentosAprovados } = useContext(OrcamentosContext);
  const { pacientes } = useContext(PacientesContext);

  // Função para formatação de valores no padrão brasileiro
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [pacotesNoCarrinho, setPacotesNoCarrinho] = useState([]);
  const [honorarios, setHonorarios] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [numeroParcelas, setNumeroParcelas] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [notification, setNotification] = useState(null);
  const [showFinalizarOrcamento, setShowFinalizarOrcamento] = useState(false);
  const [showMontarPacote, setShowMontarPacote] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [searchProduto, setSearchProduto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [nomePacoteCustom, setNomePacoteCustom] = useState('');
  const [logAlteracoes, setLogAlteracoes] = useState([
    {
      id: 1,
      tipo: 'orcamento_criado',
      descricao: 'Orçamento #001 criado para Maria Silva',
      usuario: 'Dr. João Silva',
      data: '15/01/2024 14:30'
    },
    {
      id: 2,
      tipo: 'orcamento_aceito',
      descricao: 'Orçamento #002 aceito por Ana Costa',
      usuario: 'Maria Santos',
      data: '14/01/2024 16:45'
    }
  ]);

  // Dados mockados (manter produtos e pacotes, pois ainda não estão no Firestore)
  const [produtos] = useState([
    {
      id: 1,
      nome: 'Ácido Hialurônico 1ml',
      categoria: 'Injetáveis',
      unidade: 'ml',
      custo: 85.00,
      estoque: 25.5
    },
    {
      id: 2,
      nome: 'Botox 100U',
      categoria: 'Injetáveis',
      unidade: 'unidade',
      custo: 320.00,
      estoque: 8
    },
    {
      id: 3,
      nome: 'Agulha 30G',
      categoria: 'Equipamentos',
      unidade: 'unidade',
      custo: 2.50,
      estoque: 150
    },
    {
      id: 4,
      nome: 'Creme Anestésico',
      categoria: 'Cremes',
      unidade: 'tubo',
      custo: 45.00,
      estoque: 3
    },
    {
      id: 5,
      nome: 'Serum Vitamina C',
      categoria: 'Cremes',
      unidade: 'frasco',
      custo: 120.00,
      estoque: 12
    }
  ]);

  const [pacotesProcedimentos] = useState([
    {
      id: 1,
      nome: 'Harmonização Facial Completa',
      descricao: 'Procedimento completo de harmonização facial',
      produtos: [
        { produtoId: 1, quantidade: 2, nome: 'Ácido Hialurônico 1ml' },
        { produtoId: 2, quantidade: 1, nome: 'Botox 100U' },
        { produtoId: 3, quantidade: 4, nome: 'Agulha 30G' },
        { produtoId: 4, quantidade: 1, nome: 'Creme Anestésico' }
      ]
    },
    {
      id: 2,
      nome: 'Preenchimento Labial',
      descricao: 'Preenchimento labial com ácido hialurônico',
      produtos: [
        { produtoId: 1, quantidade: 1, nome: 'Ácido Hialurônico 1ml' },
        { produtoId: 3, quantidade: 2, nome: 'Agulha 30G' },
        { produtoId: 4, quantidade: 1, nome: 'Creme Anestésico' }
      ]
    },
    {
      id: 3,
      nome: 'Botox Facial',
      descricao: 'Aplicação de toxina botulínica',
      produtos: [
        { produtoId: 2, quantidade: 1, nome: 'Botox 100U' },
        { produtoId: 3, quantidade: 3, nome: 'Agulha 30G' },
        { produtoId: 4, quantidade: 1, nome: 'Creme Anestésico' }
      ]
    },
    {
      id: 4,
      nome: 'Limpeza de Pele Premium',
      descricao: 'Limpeza de pele com produtos premium',
      produtos: [
        { produtoId: 4, quantidade: 1, nome: 'Creme Anestésico' },
        { produtoId: 5, quantidade: 1, nome: 'Serum Vitamina C' }
      ]
    }
  ]);

  const [taxasCartao] = useState([
    { parcelas: 1, taxa: 0 },
    { parcelas: 2, taxa: 5.0 },
    { parcelas: 3, taxa: 7.5 },
    { parcelas: 4, taxa: 10.0 },
    { parcelas: 5, taxa: 12.5 },
    { parcelas: 6, taxa: 15.0 },
    { parcelas: 7, taxa: 17.5 },
    { parcelas: 8, taxa: 20.0 },
    { parcelas: 9, taxa: 22.5 },
    { parcelas: 10, taxa: 25.0 },
    { parcelas: 11, taxa: 27.5 },
    { parcelas: 12, taxa: 30.0 }
  ]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (showFinalizarOrcamento) {
          handleFinalizarOrcamento();
        }
      }
      if (event.ctrlKey && event.key === 'Escape') {
        event.preventDefault();
        setShowFinalizarOrcamento(false);
        setShowPatientSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFinalizarOrcamento]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
      const [datePart] = dateStr.split(', ');
      const [day, month, year] = datePart.split('/').map(Number);
      if (!day || !month || !year) return '-';
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
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
        value = `"${value.replace(/"/g, '""')}"`;
        line += value;
      });
      str += line + '\r\n';
    });

    return str;
  };

  const adicionarPacote = (pacote) => {
    const pacoteId = Date.now() + Math.random();
    
    const novoPacote = {
      id: pacoteId,
      nome: pacote.nome,
      produtos: pacote.produtos.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return {
          id: Date.now() + Math.random() + item.produtoId,
          produtoId: item.produtoId,
          nome: produto.nome,
          unidade: produto.unidade,
          custo: produto.custo,
          quantidade: item.quantidade,
          pacoteId: pacoteId
        };
      })
    };
    
    setPacotesNoCarrinho([...pacotesNoCarrinho, novoPacote]);
    showNotification(`Pacote "${pacote.nome}" adicionado ao orçamento!`);
  };

  const adicionarProdutoIndividual = (produto) => {
    const itemExistente = carrinho.find(c => c.produtoId === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(c => 
        c.produtoId === produto.id 
          ? { ...c, quantidade: c.quantidade + 1 }
          : c
      ));
    } else {
      setCarrinho([...carrinho, {
        id: Date.now(),
        produtoId: produto.id,
        nome: produto.nome,
        unidade: produto.unidade,
        custo: produto.custo,
        quantidade: 1
      }]);
    }
    
    showNotification(`${produto.nome} adicionado ao orçamento!`);
  };

  const atualizarQuantidade = (itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(itemId);
      return;
    }
    
    setCarrinho(carrinho.map(item => 
      item.id === itemId 
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  const removerItem = (itemId) => {
    setCarrinho(carrinho.filter(item => item.id !== itemId));
    showNotification('Item removido do orçamento!');
  };

  // Funções para manipular pacotes no carrinho
  const atualizarQuantidadePacote = (pacoteId, produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerProdutoDoPacoteCarrinho(pacoteId, produtoId);
      return;
    }
    
    setPacotesNoCarrinho(pacotesNoCarrinho.map(pacote => 
      pacote.id === pacoteId 
        ? {
            ...pacote,
            produtos: pacote.produtos.map(produto => 
              produto.id === produtoId 
                ? { ...produto, quantidade: novaQuantidade }
                : produto
            )
          }
        : pacote
    ));
  };

  const removerProdutoDoPacoteCarrinho = (pacoteId, produtoId) => {
    setPacotesNoCarrinho(pacotesNoCarrinho.map(pacote => 
      pacote.id === pacoteId 
        ? {
            ...pacote,
            produtos: pacote.produtos.filter(produto => produto.id !== produtoId)
          }
        : pacote
    ).filter(pacote => pacote.produtos.length > 0)); // Remove pacote se não tiver produtos
    
    showNotification('Produto removido do pacote!');
  };

  const removerPacoteCompleto = (pacoteId) => {
    setPacotesNoCarrinho(pacotesNoCarrinho.filter(pacote => pacote.id !== pacoteId));
    showNotification('Pacote removido do orçamento!');
  };

  const calcularSubtotal = () => {
    const totalProdutosIndividuais = carrinho.reduce((total, item) => total + (item.custo * item.quantidade), 0);
    const totalPacotes = pacotesNoCarrinho.reduce((total, pacote) => {
      return total + pacote.produtos.reduce((subtotal, produto) => {
        return subtotal + (produto.custo * produto.quantidade);
      }, 0);
    }, 0);
    return totalProdutosIndividuais + totalPacotes;
  };

  const calcularTaxaCartao = () => {
    if (formaPagamento !== 'credito') return 0;
    const taxa = taxasCartao.find(t => t.parcelas === numeroParcelas)?.taxa || 0;
    return calcularSubtotal() * (taxa / 100);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const honorariosValue = parseFloat(honorarios) || 0;
    const taxaCartao = calcularTaxaCartao();
    return subtotal + honorariosValue + taxaCartao;
  };

  const handleFinalizarOrcamento = () => {
    if (!selectedPatient || (carrinho.length === 0 && pacotesNoCarrinho.length === 0)) {
      showNotification('Selecione um paciente e adicione itens ao orçamento!', 'error');
      return;
    }

    const orcamento = {
      id: Date.now(),
      paciente: selectedPatient.nome,
      telefone: selectedPatient.telefone,
      procedimento: carrinho.length > 0 ? carrinho.map(item => item.nome).join(', ') : pacotesNoCarrinho.map(p => p.nome).join(', '),
      total: calcularTotal(),
      materiais: [...carrinho.map(item => `${item.nome} (${item.quantidade})`), ...pacotesNoCarrinho.flatMap(p => p.produtos.map(prod => `${prod.nome} (${prod.quantidade})`))],
      observacoes,
      dataAprovacao: new Date().toLocaleString('pt-BR'),
      chave: Math.random().toString(36).substr(2, 9).toUpperCase(),
      agendado: false // Inicialmente não agendado
    };

    // Adicionar ao contexto de orçamentos aprovados
    setOrcamentosAprovados([...orcamentosAprovados, orcamento]);

    // Registrar no log
    setLogAlteracoes(prev => [...prev, {
      id: prev.length + 1,
      tipo: 'orcamento_criado',
      descricao: `Orçamento #${orcamento.id} criado para ${selectedPatient.nome}`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    }]);

    // Limpar o orçamento
    setSelectedPatient(null);
    setCarrinho([]);
    setPacotesNoCarrinho([]);
    setHonorarios('');
    setFormaPagamento('');
    setNumeroParcelas(1);
    setObservacoes('');
    setShowFinalizarOrcamento(false);

    showNotification('Orçamento finalizado e adicionado aos aprovados com sucesso!');
  };

  const exportData = () => {
    const dataToExport = orcamentosAprovados.map(o => ({
      'ID': o.id || '-',
      'Paciente': o.paciente || '-',
      'Telefone': o.telefone || '-',
      'Procedimento': o.procedimento || '-',
      'Materiais': o.materiais ? o.materiais.join(', ') : '-',
      'Total': `R$ ${Number(o.total || 0).toFixed(2)}`,
      'Data Aprovacao': formatDateToBrazilian(o.dataAprovacao),
      'Chave': o.chave || '-',
      'Observacoes': o.observacoes || '-',
      'Agendado': o.agendado ? 'Sim' : 'Não'
    }));

    if (dataToExport.length === 0) {
      showNotification('Nenhum orçamento para exportar.', 'warning');
      setShowExportDialog(false);
      return;
    }

    try {
      const csv = convertToCSV(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `Orcamentos - ${getFormattedDateTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('Lista de orçamentos exportada com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro ao exportar os dados!', 'error');
      console.error('Erro na exportação:', error);
    }
    setShowExportDialog(false);
  };

  // Funções para o modal de montar pacote
  const adicionarProdutoAoPacote = (produto) => {
    if (!produtosSelecionados.some(p => p.id === produto.id)) {
      setProdutosSelecionados([...produtosSelecionados, {
        ...produto,
        quantidade: 1
      }]);
    }
  };

  const atualizarQuantidadeProdutoPacote = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      setProdutosSelecionados(produtosSelecionados.filter(p => p.id !== produtoId));
    } else {
      setProdutosSelecionados(produtosSelecionados.map(p => 
        p.id === produtoId ? { ...p, quantidade: novaQuantidade } : p
      ));
    }
  };

  const salvarPacoteCustom = () => {
    if (!nomePacoteCustom || produtosSelecionados.length === 0) {
      showNotification('Preencha o nome do pacote e adicione pelo menos um produto!', 'error');
      return;
    }

    const pacoteId = Date.now() + Math.random();
    const novoPacote = {
      id: pacoteId,
      nome: nomePacoteCustom,
      produtos: produtosSelecionados.map(p => ({
        id: Date.now() + Math.random() + p.id,
        produtoId: p.id,
        nome: p.nome,
        unidade: p.unidade,
        custo: p.custo,
        quantidade: p.quantidade,
        pacoteId
      }))
    };

    setPacotesNoCarrinho([...pacotesNoCarrinho, novoPacote]);
    setProdutosSelecionados([]);
    setNomePacoteCustom('');
    setShowMontarPacote(false);
    showNotification(`Pacote "${nomePacoteCustom}" adicionado ao orçamento!`);
  };

  // Filtros
  const filteredPacientes = pacientes.filter(p => 
    p.nome.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.telefone.includes(searchPatient) ||
    p.email.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const filteredProdutos = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchProduto.toLowerCase()) &&
    (filtroCategoria === 'todos' || p.categoria === filtroCategoria)
  );

  const categorias = ['todos', ...new Set(produtos.map(p => p.categoria))];

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
              <Calculator className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Criação de Orçamentos</h1>
            </div>
            <div className="flex space-x-2">
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Exportar Dados</DialogTitle>
                    <DialogDescription>
                      Exportar lista de orçamentos em formato CSV
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button onClick={exportData} className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar Lista de Orçamentos
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paciente</CardTitle>
                <CardDescription>Selecione o paciente para o qual o orçamento será criado</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={showPatientSearch} onOpenChange={setShowPatientSearch}>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {selectedPatient ? selectedPatient.nome : 'Selecionar Paciente'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Selecionar Paciente</DialogTitle>
                      <DialogDescription>Busque e selecione o paciente para o orçamento.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Buscar por nome, telefone ou email"
                          value={searchPatient}
                          onChange={(e) => setSearchPatient(e.target.value)}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredPacientes.length > 0 ? (
                          filteredPacientes.map(paciente => (
                            <div
                              key={paciente.id}
                              className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setSelectedPatient(paciente);
                                setShowPatientSearch(false);
                                setSearchPatient('');
                              }}
                            >
                              <p className="font-medium">{paciente.nome}</p>
                              <p className="text-sm text-gray-500">{paciente.telefone} | {paciente.email}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center">Nenhum paciente encontrado.</p>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seleção de Procedimentos</CardTitle>
                <CardDescription>Adicione produtos ou pacotes ao orçamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar procedimentos ou produtos..."
                      value={searchProduto}
                      onChange={(e) => setSearchProduto(e.target.value)}
                    />
                  </div>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria === 'todos' ? 'Todas as categorias' : categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredProdutos.map(produto => (
                      <div key={produto.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-gray-500">
                            {produto.categoria} | {formatarValor(produto.custo)} / {produto.unidade}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adicionarProdutoIndividual(produto)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Pacotes de Procedimentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {pacotesProcedimentos
                          .filter(pacote => pacote.nome.toLowerCase().includes(searchProduto.toLowerCase()))
                          .map(pacote => (
                            <div key={pacote.id} className="flex items-center justify-between p-2 border rounded-lg">
                              <div>
                                <p className="font-medium">{pacote.nome}</p>
                                <p className="text-sm text-gray-500">{pacote.descricao}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => adicionarPacote(pacote)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar
                              </Button>
                            </div>
                          ))}
                      </div>
                      <Dialog open={showMontarPacote} onOpenChange={setShowMontarPacote}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Montar Pacote Personalizado
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Montar Pacote Personalizado</DialogTitle>
                            <DialogDescription>Crie um pacote personalizado selecionando produtos.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="nome-pacote">Nome do Pacote</Label>
                              <Input
                                id="nome-pacote"
                                value={nomePacoteCustom}
                                onChange={(e) => setNomePacoteCustom(e.target.value)}
                                placeholder="Ex: Pacote Rejuvenescimento"
                              />
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {filteredProdutos.map(produto => (
                                <div key={produto.id} className="flex items-center justify-between p-2 border rounded-lg">
                                  <div>
                                    <p className="font-medium">{produto.nome}</p>
                                    <p className="text-sm text-gray-500">
                                      {formatarValor(produto.custo)} / {produto.unidade}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => adicionarProdutoAoPacote(produto)}
                                    disabled={produtosSelecionados.some(p => p.id === produto.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar
                                  </Button>
                                </div>
                              ))}
                            </div>
                            {produtosSelecionados.length > 0 && (
                              <div className="border-t pt-4">
                                <h3 className="font-medium mb-2">Produtos Selecionados</h3>
                                {produtosSelecionados.map(produto => (
                                  <div key={produto.id} className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="text-sm">{produto.nome}</p>
                                      <p className="text-xs text-gray-500">{formatarValor(produto.custo)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        type="number"
                                        className="w-16 h-8"
                                        value={produto.quantidade}
                                        onChange={(e) => atualizarQuantidadeProdutoPacote(produto.id, parseInt(e.target.value) || 1)}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => atualizarQuantidadeProdutoPacote(produto.id, 0)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowMontarPacote(false)}>
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                              </Button>
                              <Button onClick={salvarPacoteCustom}>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Pacote
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log de Alterações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {logAlteracoes.map(log => (
                    <div key={log.id} className="border-b pb-2">
                      <p className="text-sm font-medium">{log.descricao}</p>
                      <p className="text-xs text-gray-500">{log.usuario} - {log.data}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carrinho</CardTitle>
                <CardDescription>Revise os itens selecionados para o orçamento</CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedPatient && (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Selecione um paciente para começar.</p>
                  </div>
                )}
                {selectedPatient && (carrinho.length > 0 || pacotesNoCarrinho.length > 0) && (
                  <div className="space-y-4">
                    {carrinho.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-sm text-gray-500">
                            {formatarValor(item.custo)} / {item.unidade}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            className="w-16 h-8"
                            value={item.quantidade}
                            onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 1)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removerItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pacotesNoCarrinho.map(pacote => (
                      <div key={pacote.id} className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold">Pacote: {pacote.nome}</p>
                          <Button variant="ghost" size="icon" onClick={() => removerPacoteCompleto(pacote.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        {pacote.produtos.map(produto => (
                          <div key={produto.id} className="flex items-center justify-between ml-4 mb-1">
                            <div>
                              <p className="text-sm">- {produto.nome}</p>
                              <p className="text-xs text-gray-500">{formatarValor(produto.custo)} / {produto.unidade}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number"
                                className="w-16 h-8"
                                value={produto.quantidade}
                                onChange={(e) => atualizarQuantidadePacote(pacote.id, produto.id, parseInt(e.target.value) || 1)}
                              />
                              <Button variant="ghost" size="icon" onClick={() => removerProdutoDoPacoteCarrinho(pacote.id, produto.id)}>
                                <X className="h-4 w-4 text-gray-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Finalização</CardTitle>
                <CardDescription>Revise e finalize o orçamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="honorarios">Honorários (R$)</Label>
                  <Input 
                    id="honorarios"
                    type="number"
                    placeholder="Ex: 500.00"
                    value={honorarios}
                    onChange={(e) => setHonorarios(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="debito">Cartão de Débito</SelectItem>
                      <SelectItem value="credito">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formaPagamento === 'credito' && (
                  <div>
                    <Label>Número de Parcelas</Label>
                    <Select value={numeroParcelas} onValueChange={(val) => setNumeroParcelas(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {taxasCartao.map(t => (
                          <SelectItem key={t.parcelas} value={t.parcelas.toString()}>
                            {t.parcelas}x {t.taxa > 0 ? `(taxa de ${t.taxa}%)` : '(sem juros)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea 
                    id="observacoes"
                    placeholder="Adicione qualquer observação relevante..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>{formatarValor(calcularSubtotal())}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Honorários:</span>
                    <span>{formatarValor(parseFloat(honorarios) || 0)}</span>
                  </div>
                  {formaPagamento === 'credito' && (
                    <div className="flex justify-between font-medium">
                      <span>Taxa de Cartão:</span>
                      <span>{formatarValor(calcularTaxaCartao())}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-xl font-bold">{formatarValor(calcularTotal())}</span>
                  </div>
                </div>
                <Dialog open={showFinalizarOrcamento} onOpenChange={setShowFinalizarOrcamento}>
                  <DialogTrigger asChild>
                    <Button className="w-full" disabled={!selectedPatient || (carrinho.length === 0 && pacotesNoCarrinho.length === 0)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Revisar e Finalizar Orçamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Finalizar Orçamento</DialogTitle>
                      <DialogDescription>
                        Confirme os detalhes antes de gerar o orçamento.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-gray-900 mb-2">Paciente</h3>
                        <p>{selectedPatient?.nome}</p>
                        <p className="text-sm text-gray-600">{selectedPatient?.telefone}</p>
                      </div>

                      <div className="p-4 bg-green-50/50 rounded-lg border border-green-200">
                        <h3 className="font-medium text-gray-900 mb-2">Itens do Orçamento</h3>
                        <div className="space-y-1">
                          {carrinho.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.nome} ({item.quantidade}x)</span>
                              <span>{formatarValor(item.custo * item.quantidade)}</span>
                            </div>
                          ))}
                          {pacotesNoCarrinho.map(pacote => (
                            <div key={pacote.id} className="border-t pt-2 mt-2">
                              <div className="font-medium">Pacote: {pacote.nome}</div>
                              {pacote.produtos.map(produto => (
                                <div key={produto.id} className="flex justify-between text-xs text-gray-600 pl-4">
                                  <span>- {produto.nome} ({produto.quantidade}x)</span>
                                  <span>{formatarValor(produto.custo * produto.quantidade)}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-200">
                        <h3 className="font-medium text-gray-900 mb-2">Valores</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>{formatarValor(calcularSubtotal())}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Honorários:</span>
                            <span>{formatarValor(parseFloat(honorarios) || 0)}</span>
                          </div>
                          {formaPagamento === 'credito' && (
                            <div className="flex justify-between text-sm">
                              <span>Taxa de Cartão:</span>
                              <span>{formatarValor(calcularTaxaCartao())}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total Geral:</span>
                            <span>{formatarValor(calcularTotal())}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-purple-700">
                          <p>Forma de Pagamento: {formaPagamento === 'pix' ? 'PIX' : formaPagamento === 'debito' ? 'Cartão de Débito' : formaPagamento === 'credito' ? 'Cartão de Crédito' : 'Dinheiro'}</p>
                          {formaPagamento === 'credito' && numeroParcelas > 1 && (
                            <p>{numeroParcelas}x de R$ {(calcularTotal() / numeroParcelas).toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      {observacoes && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h3 className="font-medium text-gray-900 mb-2">Observações</h3>
                          <p className="text-gray-700 text-sm">{observacoes}</p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handleFinalizarOrcamento} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Confirmar Orçamento
                        </Button>
                        <Button variant="outline" onClick={() => setShowFinalizarOrcamento(false)} className="flex-1">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CriacaoOrcamentos;