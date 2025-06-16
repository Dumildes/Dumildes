import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card
} from '@mui/material';
import type { Produto } from './types'; // Importar o tipo Produto

interface Props {
  formData: any;
  produtos: Produto[];
  anexos: {
    autorizacaoImportacao: File | null;
    certificadoImportacao: File | null;
    remetidoPorAnexoBi: File | null;
  };
}

const Step5Resumo: React.FC<Props> = ({ formData, produtos, anexos }) => {
  const renderField = (label: string, value: string) => (
    <Grid item xs={12} sm={6}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">
          {value || 'Não informado'}
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumo da Solicitação
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '2rem', borderRadius: '4px' }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
          Dados do Remetente
        </Typography>
          <Grid container spacing={2}>
            {renderField('Tipo de Remetente', formData.tipoRemetente)}
            {renderField('Nome', formData.nome)}
            {renderField('NIF/BI', formData.nifBi)}
            {renderField('Email', formData.email)}
            {renderField('Telefone', formData.tel)}
            {renderField('Província', formData.provincia)}
            {renderField('Município', formData.municipio)}
            {renderField('Bairro', formData.bairro)}
            {renderField('Rua', formData.rua)}
            {formData.estabelecimento && (
              <>
                {renderField('Estabelecimento', formData.estabelecimento.nome)}
                {renderField('NIF do Estabelecimento', formData.estabelecimento.nif)}
                {renderField('Número do Processo', formData.estabelecimento.numeroProcesso)}
                {renderField('Status', formData.estabelecimento.status)}
              </>
            )}
          </Grid>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '2rem', borderRadius: '4px' }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
          Produtos
        </Typography>
          {produtos.map((produto, index) => (
            <Card key={produto.id} sx={{ mb: index < produtos.length - 1 ? 4 : 0, borderRadius:'10px', p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Produto {index + 1}
              </Typography>
              <Grid container spacing={2}>
                {renderField('Nome do Produto', produto.nome)}
                {renderField('Tipo de Produto', produto.tipo)}
                {renderField('Tipo de Análise', Array.isArray(produto.tipoAnalise) ? produto.tipoAnalise.join(', ') : produto.tipoAnalise)}
                {renderField('Fabricante', produto.fabricante)}
                {renderField('País do Fabricante', produto.paisFabricante)}
                {renderField('Endereço do Fabricante', produto.enderecoFabricante)}
                {renderField('Lote', produto.lote)}
                {renderField('Data de Fabrico', produto.dataFabrico)}
                {renderField('Data de Validade', produto.dataValidade)}
                {renderField('Dosagem/Concentração', produto.dosagemConcentracao)}
                {renderField('Forma Farmacêutica', produto.formaFarmaceutica)}
              </Grid>
            </Card>
          ))}
        </Box>
      </Box>

        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '2rem', borderRadius: '4px' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
          Documentos Anexados
        </Typography>
          <Grid container spacing={2}>
            {anexos.remetidoPorAnexoBi && renderField('BI do Responsável', anexos.remetidoPorAnexoBi.name)}
            {formData.tipoRemetente === 'Importador' && (
              <>
                {anexos.autorizacaoImportacao && renderField('Autorização de Importação', anexos.autorizacaoImportacao.name)}
                {anexos.certificadoImportacao && renderField('Certificado de Importação', anexos.certificadoImportacao.name)}
              </>
            )}
            {!anexos.remetidoPorAnexoBi && renderField('BI do Responsável', 'Não anexado')}
            {formData.tipoRemetente === 'Importador' && (
              <>
                {!anexos.autorizacaoImportacao && renderField('Autorização de Importação', 'Não anexado')}
                {!anexos.certificadoImportacao && renderField('Certificado de Importação', 'Não anexado')}
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Step5Resumo;
