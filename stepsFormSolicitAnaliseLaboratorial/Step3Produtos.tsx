import React from 'react';
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Produto, FormErrors } from './types';

interface Props {
  produtos: Produto[];
  errors: FormErrors;
  handleProdutoChange: (index: number, field: keyof Produto, value: string | File | string[]) => void;
  adicionarProduto: () => void;
  removerProduto: (index: number) => void;
}

const Step3Produtos: React.FC<Props> = ({
  produtos,
  errors,
  handleProdutoChange,
  adicionarProduto,
  removerProduto
}) => {
  return (
    <Box>
      {produtos.map((produto, index) => (
        <Box key={produto.id} sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Produto {index + 1}</Typography>
            {produtos.length > 1 && (
              <IconButton
                onClick={() => removerProduto(index)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {/* Primeira linha - Tipo de Produto, Tipo de Análise, Nome do Produto */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                required
                label="Tipo de Produto"
                value={produto.tipo}
                onChange={(e) => handleProdutoChange(index, 'tipo', e.target.value)}
                error={!!errors[`produto_${index}_tipo`]}
                helperText={errors[`produto_${index}_tipo`] || 'Selecione o tipo de produto'}
              >
                <MenuItem value="">Selecione o tipo</MenuItem>
                <MenuItem value="Medicamento">Medicamento</MenuItem>
                <MenuItem value="Tecnologia de Saúde">Tecnologia de Saúde</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={!!errors[`produto_${index}_tipoAnalise`]}>
                <InputLabel id={`tipo-analise-label-${index}`}>Tipo de Análise</InputLabel>
                <Select
                  labelId={`tipo-analise-label-${index}`}
                  multiple
                  value={Array.isArray(produto.tipoAnalise) ? produto.tipoAnalise : []} // Ensure value is always an array
                  onChange={(e) => {
                    const { target: { value } } = e;
                    // On autofill we get a stringified value.
                    const selectedValues = typeof value === 'string' ? value.split(',') : value;
                    handleProdutoChange(index, 'tipoAnalise', selectedValues);
                  }}
                  input={<OutlinedInput label="Tipo de Análise" />}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                {[
                  "Análise de Inspecção Física e Visual",
                  "Análise de Desintegração",
                  "Análise de Cromatografia em Camada Fina",
                  "Validação",
                  "Outro"
                ].map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={Array.isArray(produto.tipoAnalise) && produto.tipoAnalise.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
                </Select>
                {errors[`produto_${index}_tipoAnalise`] && <Typography color="error" variant="caption">{errors[`produto_${index}_tipoAnalise`]}</Typography>}
                {!errors[`produto_${index}_tipoAnalise`] && <Typography color="textSecondary" variant="caption">Selecione o(s) tipo(s) de análise</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Nome do Produto"
                value={produto.nome}
                onChange={(e) => handleProdutoChange(index, 'nome', e.target.value)}
                error={!!errors[`produto_${index}_nome`]}
                helperText={errors[`produto_${index}_nome`] || 'Nome completo do produto'}
              />
            </Grid>
          </Grid>

          {/* Segunda linha - Fabricante, Lote, País do Fabricante */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Fabricante"
                value={produto.fabricante}
                onChange={(e) => handleProdutoChange(index, 'fabricante', e.target.value)}
                error={!!errors[`produto_${index}_fabricante`]}
                helperText={errors[`produto_${index}_fabricante`] || 'Nome do fabricante'}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Lote"
                value={produto.lote}
                onChange={(e) => handleProdutoChange(index, 'lote', e.target.value)}
                error={!!errors[`produto_${index}_lote`]}
                helperText={errors[`produto_${index}_lote`] || 'Número do lote'}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="País do Fabricante"
                value={produto.paisFabricante}
                onChange={(e) => handleProdutoChange(index, 'paisFabricante', e.target.value)}
                error={!!errors[`produto_${index}_paisFabricante`]}
                helperText={errors[`produto_${index}_paisFabricante`] || 'País de origem do fabricante'}
              />
            </Grid>
          </Grid>

          {/* Terceira linha - Endereço do Fabricante (campo completo) */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Endereço do Fabricante"
                value={produto.enderecoFabricante}
                onChange={(e) => handleProdutoChange(index, 'enderecoFabricante', e.target.value)}
                error={!!errors[`produto_${index}_enderecoFabricante`]}
                helperText={errors[`produto_${index}_enderecoFabricante`] || 'Endereço completo do fabricante'}
              />
            </Grid>
          </Grid>

          {/* Quarta linha - Data de Fabrico, Data de Validade, Dosagem/Concentração */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Data de Fabrico"
                type="date"
                value={produto.dataFabrico}
                onChange={(e) => handleProdutoChange(index, 'dataFabrico', e.target.value)}
                error={!!errors[`produto_${index}_dataFabrico`]}
                helperText={errors[`produto_${index}_dataFabrico`] || 'Data de fabricação do produto'}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Data de Validade"
                type="date"
                value={produto.dataValidade}
                onChange={(e) => handleProdutoChange(index, 'dataValidade', e.target.value)}
                error={!!errors[`produto_${index}_dataValidade`]}
                helperText={errors[`produto_${index}_dataValidade`] || 'Data de validade do produto'}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Dosagem/Concentração"
                value={produto.dosagemConcentracao}
                onChange={(e) => handleProdutoChange(index, 'dosagemConcentracao', e.target.value)}
                error={!!errors[`produto_${index}_dosagemConcentracao`]}
                helperText={errors[`produto_${index}_dosagemConcentracao`] || 'Ex: 500mg, 10ml, etc.'}
              />
            </Grid>
          </Grid>

          {/* Quinta linha - Forma Farmacêutica + Receita Médica (se aplicável) */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={produto.tipo === 'Medicamento' ? 4 : 6}>
              <TextField
                fullWidth
                required
                label="Forma Farmacêutica"
                value={produto.formaFarmaceutica}
                onChange={(e) => handleProdutoChange(index, 'formaFarmaceutica', e.target.value)}
                error={!!errors[`produto_${index}_formaFarmaceutica`]}
                helperText={errors[`produto_${index}_formaFarmaceutica`] || 'Ex: Comprimido, Xarope, Injetável'}
              />
            </Grid>

            {produto.tipo === 'Medicamento' && (
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="file"
                  label="Receita Médica"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleProdutoChange(index, 'receitaMedica', file);
                    }
                  }}
                  error={!!errors[`produto_${index}_receitaMedica`]}
                  helperText={errors[`produto_${index}_receitaMedica`] || 'Anexar receita médica (PDF, JPG, PNG)'}
                  inputProps={{
                    accept: '.pdf,.jpg,.jpeg,.png'
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      ))}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={adicionarProduto}
          fullWidth
          size="large"
        >
          Adicionar mais Produto
        </Button>
      </Box>
    </Box>
  );
};

export default Step3Produtos;