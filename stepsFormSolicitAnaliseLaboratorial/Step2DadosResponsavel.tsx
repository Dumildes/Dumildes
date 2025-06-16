import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import type { FormData, FormErrors } from './types';

interface Props {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (event: SelectChangeEvent<string>) => void;
}

const Step2DadosResponsavel: React.FC<Props> = ({
  formData,
  errors,
  handleChange,
  handleSelectChange
}) => {
  return (
    <Box>
      {/* Primeira linha - Nome, Telefone, Email */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Nome do Responsável"
            name="remetidoPorNome"
            value={formData.remetidoPorNome}
            onChange={handleChange}
            error={!!errors.remetidoPorNome}
            helperText={errors.remetidoPorNome || 'Nome completo do responsável'}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Telefone do Responsável"
            name="remetidoPorTel"
            value={formData.remetidoPorTel}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '').slice(0, 9);
              handleChange({
                target: { name: 'remetidoPorTel', value }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            error={!!errors.remetidoPorTel}
            helperText={errors.remetidoPorTel || 'Digite 9 dígitos'}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 9,
              pattern: '[0-9]*'
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Email do Responsável"
            name="remetidoPorEmail"
            type="email"
            value={formData.remetidoPorEmail}
            onChange={handleChange}
            error={!!errors.remetidoPorEmail}
            helperText={errors.remetidoPorEmail || 'Email válido do responsável'}
          />
        </Grid>
      </Grid>

      {/* Segunda linha - BI, Data de Nascimento, Gênero */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="BI do Responsável"
            name="remetidoPorBi"
            value={formData.remetidoPorBi}
            onChange={(e) => {
              let value = e.target.value;
              // Permite apenas números e letras
              value = value.replace(/[^A-Za-z0-9]/g, '');
              // Limita a 9 caracteres
              value = value.slice(0, 9);
              handleChange({
                target: { name: 'remetidoPorBi', value }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            error={!!errors.remetidoPorBi}
            helperText={errors.remetidoPorBi || 'BI do responsável (9 caracteres)'}
            inputProps={{
              maxLength: 9
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Data de Nascimento"
            name="remetidoPorDataNascimento"
            type="date"
            value={formData.remetidoPorDataNascimento}
            onChange={handleChange}
            error={!!errors.remetidoPorDataNascimento}
            helperText={errors.remetidoPorDataNascimento || 'Data de nascimento do responsável'}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required error={!!errors.remetidoPorGenero}>
            <InputLabel>Gênero</InputLabel>
            <Select
              label="Gênero"
              name="remetidoPorGenero"
              value={formData.remetidoPorGenero}
              onChange={handleSelectChange}
              error={!!errors.remetidoPorGenero}
            >
              <MenuItem value="">Selecione o gênero</MenuItem>
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Feminino</MenuItem>
              <MenuItem value="Outro">Outro</MenuItem>
            </Select>
            <FormHelperText>
              {errors.remetidoPorGenero || 'Selecione o gênero do responsável'}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2DadosResponsavel;