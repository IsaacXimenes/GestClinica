import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, ArrowLeft, Save, X, Filter, Calendar, Upload, Download, History, TrendingUp, Clock, FileText, AlertCircle } from 'lucide-react';

const EntradaEstoque = ({ onBack, user }) => {
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showBulkEntry, setShowBulkEntry] = useState(false);
  const [showBulkProductEntry, setShowBulkProductEntry] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [produtos, setProdutos] = useState([
    {
      id: 1,
      codigo_barras: '7891234567890',
      nome: 'Ácido Hialurônico 1ml',
      descricao: 'Preenchedor facial de ácido hialurônico',
      categoria: 'Injetáveis',
      unidade_medida: 'ml',
      quantidade_estoque: 25.5,
      custo_medio: 85.00,
      ponto_ressuprimento: 10.0,
      status: 'Ativo',
      data_validade: '2025-06-15',
      consumo_medio_mensal: 8.5,
      ultimo_preco_compra: 85.00,
      fornecedor_preferencial: 'MedSupply Ltda'
    },
    {
      id: 2,
      codigo_barras: '7891234567891',
      nome: 'Botox 100U',
      descricao: 'Toxina botulínica tipo A',
      categoria: 'Injetáveis',
      unidade_medida: 'unidade',
      quantidade_estoque: 8.0,
      custo_medio: 320.00,
      ponto_ressuprimento: 5.0,
      status: 'Baixo Estoque',
      data_validade: '2024-12-30',
      consumo_medio_mensal: 3.2,
      ultimo_preco_compra: 320.00,
      fornecedor_preferencial: 'BioTech Med'
    },
    {
      id: 3,
      codigo_barras: '7891234567892',
      nome: 'Agulha 30G',
      descricao: 'Agulha descartável para aplicações',
      categoria: 'Equipamentos',
      unidade_medida: 'unidade',
      quantidade_estoque: 150.0,
      custo_medio: 2.50,
      ponto_ressuprimento: 50.0,
      status: 'Ativo',
      data_validade: null,
      consumo_medio_mensal: 45.0,
      ultimo_preco_compra: 2.50,
      fornecedor_preferencial: 'Descartáveis Pro'
    },
    {
      id: 4,
      codigo_barras: '7891234567893',
      nome: 'Creme Anestésico',
      descricao: 'Creme anestésico tópico',
      categoria: 'Cremes',
      unidade_medida: 'tubo',
      quantidade_estoque: 3.0,
      custo_medio: 45.00,
      ponto_ressuprimento: 5.0,
      status: 'Baixo Estoque',
      data_validade: '2024-08-20',
      consumo_medio_mensal: 2.5,
      ultimo_preco_compra: 45.00,
      fornecedor_preferencial: 'Pharma Solutions'
    }
  ]);

  const [entradas, setEntradas] = useState([
    {
      id: 1,
      produto_id: 1,
      produto_nome: 'Ácido Hialurônico 1ml',
      quantidade: 10.0,
      valor_unitario: 85.00,
      valor_total: 850.00,
      data_entrada: '2024-01-15',
      usuario: 'Dr. João Silva',
      observacoes: 'Entrada via nota fiscal 12345',
      fornecedor: 'MedSupply Ltda',
      documento_anexo: 'nf_12345.pdf'
    },
    {
      id: 2,
      produto_id: 2,
      produto_nome: 'Botox 100U',
      quantidade: 5.0,
      valor_unitario: 320.00,
      valor_total: 1600.00,
      data_entrada: '2024-01-14',
      usuario: 'Maria Santos',
      observacoes: 'Reposição de estoque',
      fornecedor: 'BioTech Med',
      documento_anexo: null
    }
  ]);

  const [logAlteracoes, setLogAlteracoes] = useState([
    {
      id: 1,
      tipo: 'produto_criado',
      descricao: 'Produto "Ácido Hialurônico 1ml" foi cadastrado',
      usuario: 'Dr. João Silva',
      data: '2024-01-10 14:30:00'
    },
    {
      id: 2,
      tipo: 'entrada_registrada',
      descricao: 'Entrada de 10 unidades de "Ácido Hialurônico 1ml"',
      usuario: 'Maria Santos',
      data: '2024-01-15 09:15:00'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    codigo_barras: '',
    nome: '',
    descricao: '',
    categoria: '',
    unidade_medida: '',
    ponto_ressuprimento: '',
    data_validade: ''
  });

  const [newEntry, setNewEntry] = useState({
    produto_id: '',
    quantidade: '',
    valor_unitario: '',
    observacoes: '',
    fornecedor: '',
    documento_anexo: null
  });

  const [bulkEntries, setBulkEntries] = useState([
    { produto_id: '', quantidade: '', valor_unitario: '', fornecedor: '' }
  ]);

  const [bulkEntryInfo, setBulkEntryInfo] = useState({
    fornecedor: '',
    numero_nota: '',
    valor_total: ''
  });

  const [bulkProducts, setBulkProducts] = useState([
    { codigo_barras: '', nome: '', descricao: '', categoria: '', unidade_medida: '', ponto_ressuprimento: '', data_validade: '' }
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (showAddProduct) handleAddProduct();
        else if (showAddEntry) handleAddEntry();
        else if (showBulkEntry) handleBulkEntry();
        else if (showBulkProductEntry) handleBulkProductEntry();
      }
      if (event.ctrlKey && event.key === 'Escape') {
        event.preventDefault();
        setShowAddProduct(false);
        setShowAddEntry(false);
        setShowBulkEntry(false);
        setShowBulkProductEntry(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddProduct, showAddEntry, showBulkEntry, showBulkProductEntry]);

  const filteredProducts = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo_barras.includes(searchTerm) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || produto.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateCodigoBarras = (codigo) => {
    return !produtos.some(p => p.codigo_barras === codigo && p.id !== editingProduct?.id);
  };

  const checkPriceAlert = (produtoId, novoPreco) => {
    const produto = produtos.find(p => p.id === parseInt(produtoId));
    if (produto && produto.ultimo_preco_compra) {
      const diferenca = Math.abs(novoPreco - produto.ultimo_preco_compra) / produto.ultimo_preco_compra;
      if (diferenca > 0.2) {
        return `⚠️ Preço ${diferenca > 0 ? 'maior' : 'menor'} que a última compra (R$ ${produto.ultimo_preco_compra.toFixed(2)})`;
      }
    }
    return null;
  };

  const calcularPrevisaoRessuprimento = (produto) => {
    if (produto.consumo_medio_mensal > 0) {
      const diasRestantes = Math.floor((produto.quantidade_estoque - produto.ponto_ressuprimento) / (produto.consumo_medio_mensal / 30));
      return diasRestantes > 0 ? `${diasRestantes} dias` : 'Urgente';
    }
    return 'N/A';
  };

  const handleAddProduct = () => {
    if (!validateCodigoBarras(newProduct.codigo_barras)) {
      showNotification('Código de barras já existe!', 'error');
      return;
    }

    const produto = {
      id: produtos.length + 1,
      ...newProduct,
      quantidade_estoque: 0,
      custo_medio: 0,
      status: 'Ativo',
      consumo_medio_mensal: 0,
      ultimo_preco_compra: 0,
      fornecedor_preferencial: ''
    };
    
    setProdutos([...produtos, produto]);
    const novoLog = {
      id: logAlteracoes.length + 1,
      tipo: 'produto_criado',
      descricao: `Produto "${newProduct.nome}" foi cadastrado`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    };
    setLogAlteracoes([novoLog, ...logAlteracoes]);
    
    setNewProduct({
      codigo_barras: '',
      nome: '',
      descricao: '',
      categoria: '',
      unidade_medida: '',
      ponto_ressuprimento: '',
      data_validade: ''
    });
    setShowAddProduct(false);
    showNotification('Produto cadastrado com sucesso!');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      codigo_barras: product.codigo_barras,
      nome: product.nome,
      descricao: product.descricao,
      categoria: product.categoria,
      unidade_medida: product.unidade_medida,
      ponto_ressuprimento: product.ponto_ressuprimento,
      data_validade: product.data_validade
    });
    setShowAddProduct(true);
  };

  const handleSaveEditedProduct = () => {
    if (!editingProduct) return;

    if (!validateCodigoBarras(newProduct.codigo_barras)) {
      showNotification('Código de barras já existe!', 'error');
      return;
    }

    setProdutos(produtos.map(p =>
      p.id === editingProduct.id
        ? { ...p, ...newProduct, ponto_ressuprimento: parseFloat(newProduct.ponto_ressuprimento) || 0 }
        : p
    ));

    const novoLog = {
      id: logAlteracoes.length + 1,
      tipo: 'produto_editado',
      descricao: `Produto "${editingProduct.nome}" foi editado`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    };
    setLogAlteracoes([novoLog, ...logAlteracoes]);

    setEditingProduct(null);
    setShowAddProduct(false);
    showNotification('Produto atualizado com sucesso!');
  };

  const handleDeleteProduct = (id) => {
    const produtoExcluido = produtos.find(p => p.id === id);
    setProdutos(produtos.filter(p => p.id !== id));
    
    const novoLog = {
      id: logAlteracoes.length + 1,
      tipo: 'produto_excluido',
      descricao: `Produto "${produtoExcluido.nome}" foi excluído`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    };
    setLogAlteracoes([novoLog, ...logAlteracoes]);

    showNotification('Produto excluído com sucesso!');
  };

  const handleAddEntry = () => {
    const produto = produtos.find(p => p.id === parseInt(newEntry.produto_id));
    if (!produto) {
      showNotification('Produto não encontrado!', 'error');
      return;
    }
    const valorTotal = parseFloat(newEntry.quantidade) * parseFloat(newEntry.valor_unitario);
    
    const priceAlert = checkPriceAlert(newEntry.produto_id, parseFloat(newEntry.valor_unitario));
    if (priceAlert) showNotification(priceAlert, 'warning');
    
    const entrada = {
      id: entradas.length + 1,
      produto_id: parseInt(newEntry.produto_id),
      produto_nome: produto.nome,
      quantidade: parseFloat(newEntry.quantidade),
      valor_unitario: parseFloat(newEntry.valor_unitario),
      valor_total: valorTotal,
      data_entrada: new Date().toISOString().split('T')[0],
      usuario: user.nome,
      observacoes: newEntry.observacoes,
      fornecedor: newEntry.fornecedor,
      documento_anexo: uploadedFile?.name || null
    };

    setEntradas([entrada, ...entradas]);
    
    setProdutos(produtos.map(p => {
      if (p.id === parseInt(newEntry.produto_id)) {
        const novaQuantidade = p.quantidade_estoque + parseFloat(newEntry.quantidade);
        const novoCusto = ((p.quantidade_estoque * p.custo_medio) + valorTotal) / novaQuantidade;
        return {
          ...p,
          quantidade_estoque: novaQuantidade,
          custo_medio: novoCusto,
          ultimo_preco_compra: parseFloat(newEntry.valor_unitario),
          status: novaQuantidade <= p.ponto_ressuprimento ? 'Baixo Estoque' : 'Ativo'
        };
      }
      return p;
    }));

    const novoLog = {
      id: logAlteracoes.length + 1,
      tipo: 'entrada_registrada',
      descricao: `Entrada de ${newEntry.quantidade} unidades de "${produto.nome}"`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    };
    setLogAlteracoes([novoLog, ...logAlteracoes]);

    setNewEntry({
      produto_id: '',
      quantidade: '',
      valor_unitario: '',
      observacoes: '',
      fornecedor: '',
      documento_anexo: null
    });
    setUploadedFile(null);
    setShowAddEntry(false);
    showNotification('Entrada registrada com sucesso!');
  };

  const handleBulkEntry = () => {
    let totalEntradas = 0;
    
    bulkEntries.forEach((entry, index) => {
      if (entry.produto_id && entry.quantidade && entry.valor_unitario) {
        const produto = produtos.find(p => p.id === parseInt(entry.produto_id));
        const valorTotal = parseFloat(entry.quantidade) * parseFloat(entry.valor_unitario);
        
        const entrada = {
          id: entradas.length + totalEntradas + 1,
          produto_id: parseInt(entry.produto_id),
          produto_nome: produto.nome,
          quantidade: parseFloat(entry.quantidade),
          valor_unitario: parseFloat(entry.valor_unitario),
          valor_total: valorTotal,
          data_entrada: new Date().toISOString().split('T')[0],
          usuario: user.nome,
          observacoes: `Entrada em lote - Item ${index + 1}`,
          fornecedor: entry.fornecedor,
          documento_anexo: uploadedFile?.name || null
        };
        
        setEntradas(prev => [entrada, ...prev]);
        totalEntradas++;
        
        setProdutos(prev => prev.map(p => {
          if (p.id === parseInt(entry.produto_id)) {
            const novaQuantidade = p.quantidade_estoque + parseFloat(entry.quantidade);
            const novoCusto = ((p.quantidade_estoque * p.custo_medio) + valorTotal) / novaQuantidade;
            return {
              ...p,
              quantidade_estoque: novaQuantidade,
              custo_medio: novoCusto,
              ultimo_preco_compra: parseFloat(entry.valor_unitario),
              status: novaQuantidade <= p.ponto_ressuprimento ? 'Baixo Estoque' : 'Ativo'
            };
          }
          return p;
        }));
      }
    });
    
    const novoLog = {
      id: logAlteracoes.length + 1,
      tipo: 'entrada_lote',
      descricao: `Entrada em lote de ${totalEntradas} produtos`,
      usuario: user.nome,
      data: new Date().toLocaleString('pt-BR')
    };
    setLogAlteracoes([novoLog, ...logAlteracoes]);
    
    setBulkEntries([{ produto_id: '', quantidade: '', valor_unitario: '', fornecedor: '' }]);
    setUploadedFile(null);
    setShowBulkEntry(false);
    showNotification(`${totalEntradas} entradas registradas com sucesso!`);
  };

  const addBulkEntryRow = () => {
    setBulkEntries([...bulkEntries, { produto_id: '', quantidade: '', valor_unitario: '', fornecedor: '' }]);
  };

  const removeBulkEntryRow = (index) => {
    setBulkEntries(bulkEntries.filter((_, i) => i !== index));
  };

  const updateBulkEntry = (index, field, value) => {
    const updated = [...bulkEntries];
    updated[index][field] = value;
    setBulkEntries(updated);
  };

  const handleBulkProductEntry = () => {
    const validProducts = bulkProducts.filter(p => p.codigo_barras && p.nome && p.categoria && p.unidade_medida);
    
    if (validProducts.length === 0) {
      showNotification('Preencha pelo menos um produto válido!', 'error');
      return;
    }

    const codigosExistentes = produtos.map(p => p.codigo_barras);
    const codigosDuplicados = validProducts.filter(p => codigosExistentes.includes(p.codigo_barras));
    
    if (codigosDuplicados.length > 0) {
      showNotification(`Códigos já existem: ${codigosDuplicados.map(p => p.codigo_barras).join(', ')}`, 'error');
      return;
    }

    const novosProdutos = validProducts.map((produto, index) => ({
      id: produtos.length + index + 1,
      ...produto,
      quantidade_estoque: 0,
      custo_medio: 0,
      ponto_ressuprimento: parseFloat(produto.ponto_ressuprimento) || 0,
      status: 'Ativo',
      consumo_medio_mensal: 0,
      ultimo_preco_compra: 0,
      fornecedor_preferencial: ''
    }));

    setProdutos([...produtos, ...novosProdutos]);
    
    novosProdutos.forEach(produto => {
      setLogAlteracoes(prev => [...prev, {
        id: prev.length + 1,
        tipo: 'produto_criado',
        descricao: `Produto "${produto.nome}" foi cadastrado em lote`,
        usuario: user.nome,
        data: new Date().toLocaleString('pt-BR')
      }]);
    });

    setBulkProducts([{ codigo_barras: '', nome: '', descricao: '', categoria: '', unidade_medida: '', ponto_ressuprimento: '', data_validade: '' }]);
    setShowBulkProductEntry(false);
    showNotification(`${validProducts.length} produtos cadastrados com sucesso!`);
  };

  const addBulkProductRow = () => {
    setBulkProducts([...bulkProducts, { codigo_barras: '', nome: '', descricao: '', categoria: '', unidade_medida: '', ponto_ressuprimento: '', data_validade: '' }]);
  };

  const removeBulkProductRow = (index) => {
    setBulkProducts(bulkProducts.filter((_, i) => i !== index));
  };

  const updateBulkProduct = (index, field, value) => {
    const updated = [...bulkProducts];
    updated[index][field] = value;
    setBulkProducts(updated);
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const formatDateToBrazilian = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
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

  const handleExportData = (type) => {
    let dataToExport = [];
    let filename = '';

    if (type === 'produtos') {
      dataToExport = produtos.map(p => ({
        'ID': p.id || '-',
        'Código de Barras': p.codigo_barras || '-',
        'Nome': p.nome || '-',
        'Descrição': p.descricao || '-',
        'Categoria': p.categoria || '-',
        'Quantidade em Estoque': Number(p.quantidade_estoque || 0).toFixed(2),
        'Unidade de Medida': p.unidade_medida || '-',
        'Custo Médio': `R$ ${Number(p.custo_medio || 0).toFixed(2)}`,
        'Ponto de Ressuprimento': Number(p.ponto_ressuprimento || 0).toFixed(2),
        'Status': p.status || '-',
        'Data de Validade': formatDateToBrazilian(p.data_validade),
        'Consumo Médio Mensal': Number(p.consumo_medio_mensal || 0).toFixed(2),
        'Último Preço de Compra': `R$ ${Number(p.ultimo_preco_compra || 0).toFixed(2)}`,
        'Fornecedor Preferencial': p.fornecedor_preferencial || '-'
      }));
      filename = `Produtos_Estoque - ${getFormattedDateTime()}.csv`;
    } else if (type === 'entradas') {
      dataToExport = entradas.map(e => ({
        'ID': e.id || '-',
        'ID Produto': e.produto_id || '-',
        'Nome Produto': e.produto_nome || '-',
        'Quantidade': Number(e.quantidade || 0).toFixed(2),
        'Valor Unitário': `R$ ${Number(e.valor_unitario || 0).toFixed(2)}`,
        'Valor Total': `R$ ${Number(e.valor_total || 0).toFixed(2)}`,
        'Data Entrada': formatDateToBrazilian(e.data_entrada),
        'Usuário': e.usuario || '-',
        'Observações': e.observacoes || '-',
        'Fornecedor': e.fornecedor || '-',
        'Documento Anexo': e.documento_anexo || '-'
      }));
      filename = `Historico_Entradas - ${getFormattedDateTime()}.csv`;
    }

    if (dataToExport.length === 0) {
      showNotification(`Nenhum dado de ${type} para exportar.`, 'warning');
      setShowExportDialog(false);
      return;
    }

    try {
      const csv = convertToCSV(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification(`Dados de ${type} exportados com sucesso!`, 'success');
    } catch (error) {
      showNotification('Erro ao exportar os dados!', 'error');
      console.error('Erro na exportação:', error);
    }
    setShowExportDialog(false);
  };

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '\uFEFF'; // Adiciona o BOM para UTF-8
    let row = '';

    if (array.length === 0) return str;

    // Cabeçalhos
    for (let index in array[0]) {
      if (row !== '') row += ';'; // Usa ponto e vírgula como separador
      row += `"${index.replace(/"/g, '""')}"`; // Escapa aspas duplas nos cabeçalhos
    }
    str += row + '\r\n';

    // Linhas de dados
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line !== '') line += ';'; // Usa ponto e vírgula como separador
        let value = array[i][index] !== null && array[i][index] !== undefined ? array[i][index].toString() : '-';
        // Força o campo "Código de Barras" a ser tratado como texto
        if (index === 'Código de Barras') {
          value = `"=""${value.replace(/"/g, '""')}"""`; // Adiciona ="..." para forçar texto no Excel
        } else {
          value = `"${value.replace(/"/g, '""')}"`; // Escapa aspas duplas nos outros valores
        }
        line += value;
      }
      str += line + '\r\n';
    }
    return str;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ativo':
        return <Badge variant="default">Ativo</Badge>;
      case 'Baixo Estoque':
        return <Badge variant="destructive">Baixo Estoque</Badge>;
      case 'Inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

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
              <Package className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
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
                        Histórico de todas as alterações no estoque
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="entradas">Histórico de Entradas</TabsTrigger>
          </TabsList>
          <TabsContent value="produtos">
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Estoque</CardTitle>
                <CardDescription>
                  Gerencie todos os produtos disponíveis na clínica.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar produto por nome, código ou categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Baixo Estoque">Baixo Estoque</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowAddProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                  <Button variant="outline" onClick={() => setShowBulkProductEntry(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Cadastro em Lote
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custo Médio</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((produto) => (
                        <tr key={produto.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.codigo_barras}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.nome}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.categoria}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {produto.quantidade_estoque} {produto.unidade_medida}
                            {produto.quantidade_estoque <= produto.ponto_ressuprimento && (
                              <p className="text-xs text-red-500">Ressuprir em: {calcularPrevisaoRessuprimento(produto)}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.unidade_medida}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {produto.custo_medio.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(produto.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.data_validade || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProduct(produto)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(produto.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="entradas">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Entradas</CardTitle>
                <CardDescription>
                  Visualize e registre as entradas de produtos no estoque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Button onClick={() => setShowAddEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Entrada
                  </Button>
                  <Button variant="outline" onClick={() => setShowBulkEntry(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Entrada em Lote
                  </Button>
                  <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unitário</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entradas.map((entrada) => (
                        <tr key={entrada.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entrada.produto_nome}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrada.quantidade.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {entrada.valor_unitario.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {entrada.valor_total.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrada.data_entrada}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrada.usuario}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrada.fornecedor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entrada.documento_anexo ? (
                              <span title={entrada.documento_anexo}>{entrada.documento_anexo.length > 20 ? `${entrada.documento_anexo.slice(0, 20)}...` : entrada.documento_anexo}</span>
                            ) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Edite os detalhes do produto.' : 'Preencha os detalhes para adicionar um novo produto.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="codigo_barras">Código de Barras</Label>
                <Input
                  id="codigo_barras"
                  value={newProduct.codigo_barras}
                  onChange={(e) => setNewProduct({ ...newProduct, codigo_barras: e.target.value })}
                  placeholder="Ex: 7891234567890"
                />
              </div>
              <div>
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={newProduct.nome}
                  onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
                  placeholder="Ex: Ácido Hialurônico 1ml"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newProduct.descricao}
                  onChange={(e) => setNewProduct({ ...newProduct, descricao: e.target.value })}
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={newProduct.categoria}
                  onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                  placeholder="Ex: Injetáveis, Cremes"
                />
              </div>
              <div>
                <Label htmlFor="unidade_medida">Unidade de Medida</Label>
                <Input
                  id="unidade_medida"
                  value={newProduct.unidade_medida}
                  onChange={(e) => setNewProduct({ ...newProduct, unidade_medida: e.target.value })}
                  placeholder="Ex: ml, unidade, tubo"
                />
              </div>
              <div>
                <Label htmlFor="ponto_ressuprimento">Ponto de Ressuprimento</Label>
                <Input
                  id="ponto_ressuprimento"
                  type="number"
                  value={newProduct.ponto_ressuprimento}
                  onChange={(e) => setNewProduct({ ...newProduct, ponto_ressuprimento: e.target.value })}
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <Label htmlFor="data_validade">Data de Validade (Opcional)</Label>
                <Input
                  id="data_validade"
                  type="date"
                  value={newProduct.data_validade}
                  onChange={(e) => setNewProduct({ ...newProduct, data_validade: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    codigo_barras: '',
                    nome: '',
                    descricao: '',
                    categoria: '',
                    unidade_medida: '',
                    ponto_ressuprimento: '',
                    data_validade: ''
                  });
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={editingProduct ? handleSaveEditedProduct : handleAddProduct}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nova Entrada</DialogTitle>
              <DialogDescription>
                Adicione produtos ao estoque.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="produto_entrada">Produto</Label>
                <Select
                  value={newEntry.produto_id}
                  onValueChange={(value) => setNewEntry({ ...newEntry, produto_id: value })}
                >
                  <SelectTrigger id="produto_entrada">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map(produto => (
                      <SelectItem key={produto.id} value={produto.id.toString()}>
                        {produto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantidade_entrada">Quantidade</Label>
                <Input
                  id="quantidade_entrada"
                  type="number"
                  value={newEntry.quantidade}
                  onChange={(e) => setNewEntry({ ...newEntry, quantidade: e.target.value })}
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <Label htmlFor="valor_unitario_entrada">Valor Unitário</Label>
                <Input
                  id="valor_unitario_entrada"
                  type="number"
                  value={newEntry.valor_unitario}
                  onChange={(e) => setNewEntry({ ...newEntry, valor_unitario: e.target.value })}
                  placeholder="Ex: 85.00"
                />
              </div>
              <div>
                <Label htmlFor="fornecedor_entrada">Fornecedor</Label>
                <Input
                  id="fornecedor_entrada"
                  value={newEntry.fornecedor}
                  onChange={(e) => setNewEntry({ ...newEntry, fornecedor: e.target.value })}
                  placeholder="Ex: MedSupply Ltda"
                />
              </div>
              <div>
                <Label htmlFor="observacoes_entrada">Observações (Opcional)</Label>
                <Textarea
                  id="observacoes_entrada"
                  value={newEntry.observacoes}
                  onChange={(e) => setNewEntry({ ...newEntry, observacoes: e.target.value })}
                  placeholder="Observações sobre a entrada..."
                />
              </div>
              <div>
                <Label htmlFor="documento_anexo">Documento Anexo (Opcional)</Label>
                <Input
                  id="documento_anexo"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddEntry(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleAddEntry}>
                  <Save className="h-4 w-4 mr-2" />
                  Registrar Entrada
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showBulkEntry} onOpenChange={setShowBulkEntry}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Entrada de Produtos em Lote</DialogTitle>
              <DialogDescription>
                Registre a entrada de múltiplos produtos de uma vez.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bulkFornecedor">Fornecedor</Label>
                  <Input
                    id="bulkFornecedor"
                    value={bulkEntryInfo.fornecedor}
                    onChange={(e) => setBulkEntryInfo({ ...bulkEntryInfo, fornecedor: e.target.value })}
                    placeholder="Nome do Fornecedor"
                  />
                </div>
                <div>
                  <Label htmlFor="bulkNumeroNota">Número da Nota Fiscal</Label>
                  <Input
                    id="bulkNumeroNota"
                    value={bulkEntryInfo.numero_nota}
                    onChange={(e) => setBulkEntryInfo({ ...bulkEntryInfo, numero_nota: e.target.value })}
                    placeholder="NF-XXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="bulkValorTotal">Valor Total da Nota</Label>
                  <Input
                    id="bulkValorTotal"
                    type="number"
                    value={bulkEntryInfo.valor_total}
                    onChange={(e) => setBulkEntryInfo({ ...bulkEntryInfo, valor_total: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto border rounded-md p-4 space-y-4">
                {bulkEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 items-end">
                    <div className="col-span-2">
                      <Label htmlFor={`bulkProduto_${index}`}>Produto</Label>
                      <Select
                        value={entry.produto_id}
                        onValueChange={(value) => updateBulkEntry(index, 'produto_id', value)}
                      >
                        <SelectTrigger id={`bulkProduto_${index}`}>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map(produto => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`bulkQuantidade_${index}`}>Qtd</Label>
                      <Input
                        id={`bulkQuantidade_${index}`}
                        type="number"
                        value={entry.quantidade}
                        onChange={(e) => updateBulkEntry(index, 'quantidade', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bulkValorUnitario_${index}`}>Valor Unit.</Label>
                      <Input
                        id={`bulkValorUnitario_${index}`}
                        type="number"
                        value={entry.valor_unitario}
                        onChange={(e) => updateBulkEntry(index, 'valor_unitario', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Button variant="destructive" size="icon" onClick={() => removeBulkEntryRow(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addBulkEntryRow}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Linha
                </Button>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bulkDocumentoAnexo" className="text-right">Documento Anexo</Label>
                <Input
                  id="bulkDocumentoAnexo"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBulkEntry(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleBulkEntry}>
                <Save className="h-4 w-4 mr-2" />
                Registrar Entradas
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showBulkProductEntry} onOpenChange={setShowBulkProductEntry}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastro de Produtos em Lote</DialogTitle>
              <DialogDescription>
                Cadastre múltiplos produtos de uma vez.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="max-h-96 overflow-y-auto border rounded-md p-4 space-y-4">
                {bulkProducts.map((product, index) => (
                  <div key={index} className="grid grid-cols-7 gap-2 items-end">
                    <div>
                      <Label htmlFor={`bulkProdCodigo_${index}`}>Código</Label>
                      <Input
                        id={`bulkProdCodigo_${index}`}
                        value={product.codigo_barras}
                        onChange={(e) => updateBulkProduct(index, 'codigo_barras', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`bulkProdNome_${index}`}>Nome</Label>
                      <Input
                        id={`bulkProdNome_${index}`}
                        value={product.nome}
                        onChange={(e) => updateBulkProduct(index, 'nome', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bulkProdCategoria_${index}`}>Categoria</Label>
                      <Input
                        id={`bulkProdCategoria_${index}`}
                        value={product.categoria}
                        onChange={(e) => updateBulkProduct(index, 'categoria', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bulkProdUnidade_${index}`}>Unidade</Label>
                      <Input
                        id={`bulkProdUnidade_${index}`}
                        value={product.unidade_medida}
                        onChange={(e) => updateBulkProduct(index, 'unidade_medida', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`bulkProdPontoRessuprimento_${index}`}>Ponto Ress.</Label>
                      <Input
                        id={`bulkProdPontoRessuprimento_${index}`}
                        type="number"
                        value={product.ponto_ressuprimento}
                        onChange={(e) => updateBulkProduct(index, 'ponto_ressuprimento', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Button variant="destructive" size="icon" onClick={() => removeBulkProductRow(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addBulkProductRow}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Linha
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBulkProductEntry(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleBulkProductEntry}>
                <Save className="h-4 w-4 mr-2" />
                Cadastrar Produtos
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Exportar Dados</DialogTitle>
              <DialogDescription>
                Selecione o tipo de dados que deseja exportar para CSV.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => handleExportData('produtos')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Produtos
              </Button>
              <Button className="w-full" onClick={() => handleExportData('entradas')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Histórico de Entradas
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default EntradaEstoque;