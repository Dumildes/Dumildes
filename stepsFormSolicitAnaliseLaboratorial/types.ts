// Definindo as interfaces como tipos exportados
export type FormData = {
  tipoRemetente: string;
  nome: string;
  nifBi: string;
  email: string;
  tel: string;
  provincia: string;
  municipio: string;
  bairro: string;
  justificativa: string;
  remetidoPorNome: string;
  remetidoPorTel: string;
  remetidoPorEmail: string;
  remetidoPorBi: string;
  remetidoPorDataNascimento: string;
  remetidoPorGenero: string;
};

export type Produto = {
  id: string;
  tipo: string;
  tipoAnalise: string[];
  nome: string;
  fabricante: string;
  lote: string;
  paisFabricante: string;
  enderecoFabricante: string;
  dataFabrico: string;
  dataValidade: string;
  dosagemConcentracao: string;
  formaFarmaceutica: string;
  receitaMedica?: File;
};

export type FormErrors = {
  [key: string]: string;
};
