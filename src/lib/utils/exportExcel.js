import * as XLSX from 'xlsx';

export const exportarOrcamentosParaExcel = (orcamentos) => {
  if (!orcamentos || orcamentos.length === 0) {
    alert('Nenhum orçamento encontrado para exportar.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(orcamentos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orçamentos');

  XLSX.writeFile(wb, 'orcamentos_aprovados.xlsx');
};
