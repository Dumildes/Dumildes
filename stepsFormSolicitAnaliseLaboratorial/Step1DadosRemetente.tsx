import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
  CircularProgress,
  Avatar
} from '@mui/material';
import { Search } from '@mui/icons-material';
import api from '../../../../../services/api';
import { SelectChangeEvent } from '@mui/material/Select';
import type { FormData, FormErrors } from './types';
import apiCNP from '../../../../../services/apiCNP';

interface Provincia {
  _id: string;
  designacao: string;
  municipios: Array<{
    _id: string;
    designacao: string;
  }>;
}

interface Props {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (event: SelectChangeEvent<string>) => void;
}

interface EstabelecimentoAPI {
  estabelecimentoId: string;
  logo: string;
  nome: string;
  provincia: string;
  municipio: string;
  bairro: string;
  nifBi: string;
  tel: string;
  email: string;
  remetidoPorNome: string;
}

interface Estabelecimento {
  _id: string;
  nome: string;
  logo: string;
  provincia: string;
  municipio: string;
  bairro: string;
  nif: string;
  nifBi: string;
  telefone: string;
  tel: string;
  email: string;
  status: string;
  approved: boolean;
  numeroProcesso: string;
  rua: string;
  empresa: {
    _id: string;
    nome: string;
    nif: string;
    tel1: string;
    provincia: string;
    municipio: string;
    bairro: string;
    rua: string;
    representante: string;
  };
}

const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^\d{9}$/;
  return re.test(phone);
};

const validateNIF = (nif: string): boolean => {
  // Permite números ou letras e números, total de 9 caracteres
  const re = /^(?:\d{9}|[A-Za-z0-9]{9})$/;
  return re.test(nif);
};

const formatPhone = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  // Limita a 9 dígitos
  return numbers.slice(0, 9);
};

const Step1DadosRemetente = ({
  formData,
  errors,
  handleChange,
  handleSelectChange
}: Props) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [estabelecimentosEncontrados, setEstabelecimentosEncontrados] = useState<Estabelecimento[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Array<{ _id: string; designacao: string }>>([]);

  // Carregar províncias ao montar o componente
  React.useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await apiCNP.get('/provincias');
        // console.log('Resposta da API de províncias:', response.data);
        // Usar o array de províncias da resposta
        const { provincias } = response.data;
        setProvincias(Array.isArray(provincias) ? provincias : []);
      } catch (error) {
        console.error('Erro ao carregar províncias:', error);
        setProvincias([]);
      }
    };

    fetchProvincias();
  }, []);

  // Atualizar municípios quando a província for selecionada
  React.useEffect(() => {
    if (formData.provincia) {
      try {
        // Buscar a província selecionada
        const provinciaSelected = provincias.find(p => p.designacao === formData.provincia);
        if (provinciaSelected) {
          // Fazer uma nova chamada para pegar os detalhes da província
          const fetchProvinciaDetails = async () => {
            try {
              const response = await apiCNP.get(`/municipios-by-provincia/${provinciaSelected._id}`);
              // console.log('Detalhes da província:', response.data);
              const { municipios } = response.data;
              setMunicipios(Array.isArray(municipios) ? municipios : []);
            } catch (error) {
              console.error('Erro ao carregar detalhes da província:', error);
              setMunicipios([]);
            }
          };
          fetchProvinciaDetails();
        }
      } catch (error) {
        console.error('Erro ao processar província:', error);
        setMunicipios([]);
      }
    } else {
      setMunicipios([]);
    }

    // Limpar o município selecionado quando mudar a província
    if (formData.municipio) {
      handleChange({
        target: { name: 'municipio', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [formData.provincia, provincias]);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setSearching(true);
    setSearchError('');

    try {
      // console.log('Enviando requisição com:', { search: searchTerm });

      const response = await api.post('/estabelecimento/search', {
        search: searchTerm
      });

      // console.log('Resposta da API:', response.data);

      if (response.data && response.data.estabelecimentos) {
        // console.log('Estabelecimentos encontrados:', response.data.estabelecimentos);

        // Converter os dados da API para o formato do estabelecimento
        // Mapear todos os estabelecimentos
        const estabelecimentos = response.data.estabelecimentos.map((estabelecimentoData: any) => ({
          _id: estabelecimentoData._id,
          nome: estabelecimentoData.nome,
          provincia: estabelecimentoData.provincia,
          municipio: estabelecimentoData.municipio,
          bairro: estabelecimentoData.bairro,
          nif: estabelecimentoData.empresa?.nif,
          nifBi: estabelecimentoData.empresa?.nif,
          telefone: estabelecimentoData.empresa?.tel1,
          tel: estabelecimentoData.empresa?.tel1,
          email: estabelecimentoData.directorTecnico?.email,
          status: estabelecimentoData.status,
          approved: estabelecimentoData.approved,
          numeroProcesso: estabelecimentoData.numeroProcesso,
          rua: estabelecimentoData.rua,
          empresa: {
            _id: estabelecimentoData.empresa?._id,
            nome: estabelecimentoData.empresa?.nome,
            nif: estabelecimentoData.empresa?.nif,
            tel1: estabelecimentoData.empresa?.tel1,
            provincia: estabelecimentoData.empresa?.provincia,
            municipio: estabelecimentoData.empresa?.municipio,
            bairro: estabelecimentoData.empresa?.bairro,
            rua: estabelecimentoData.empresa?.rua,
            representante: estabelecimentoData.empresa?.representante
          }
        }));

        setEstabelecimentosEncontrados(estabelecimentos);
      } else {
        // console.log('Nenhum estabelecimento encontrado na resposta');
        setSearchError('Estabelecimento não encontrado');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setSearchError('Erro ao buscar estabelecimento');
    } finally {
      setSearching(false);
    }
  };

  const showSearch = formData.tipoRemetente === 'Importador' || formData.tipoRemetente === 'Distribuidor';

  return (
    <Box>
      {/* Primeira linha - Tipo de Remetente */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth error={!!errors.tipoRemetente}>
            <InputLabel>Tipo de Remetente</InputLabel>
            <Select
              label="Tipo de Remetente"
              name="tipoRemetente"
              value={formData.tipoRemetente}
              onChange={handleSelectChange}
              defaultValue='Tipo de Remitente'
              error={!!errors.tipoRemetente}
            >
              <MenuItem value="Importador">Importador</MenuItem>
              <MenuItem value="Distribuidor">Distribuidor</MenuItem>
              <MenuItem value="Singular">Singular</MenuItem>
              <MenuItem value="Colectivo">Colectivo</MenuItem>
            </Select>
            {errors.tipoRemetente && (
              <FormHelperText>{errors.tipoRemetente}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Seção de Busca */}
      {showSearch && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Número de Processo ou Autorização"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleSearch}
                          disabled={searching || !searchTerm}
                        >
                          {searching ? <CircularProgress size={24} /> : <Search />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {searchError && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {searchError}
                </Typography>
              )}
              {estabelecimentosEncontrados.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Estabelecimentos Encontrados:
                  </Typography>
                  {estabelecimentosEncontrados.map((estabelecimento, index) => (
                    <Paper
                      key={estabelecimento._id}
                      sx={{
                        display: 'flex',
                        alignItems:'center',
                        p: 2,
                        gap:4,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => {
                        // Atualizar os campos do formulário
                        const fieldsToUpdate = {
                          nome: estabelecimento.nome || '',
                          nifBi: estabelecimento.nifBi || estabelecimento.nif || '',
                          email: estabelecimento.email || '',
                          tel: estabelecimento.tel || estabelecimento.telefone || '',
                          provincia: estabelecimento.provincia || '',
                          municipio: estabelecimento.municipio || '',
                          bairro: estabelecimento.bairro || ''
                        };

                        Object.entries(fieldsToUpdate).forEach(([field, value]) => {
                          handleChange({
                            target: { name: field, value }
                          } as React.ChangeEvent<HTMLInputElement>);
                        });

                        // Limpar a lista de estabelecimentos
                        setEstabelecimentosEncontrados([]);
                      }}
                    >
                      <Box>
                        <Avatar alt="Fulano da Silva" sx={{ borderRadius: 1, width: 100, height: 100,
                        
                         }} src={estabelecimento.logo}/>
                      </Box>
                      <Box>
                      <Typography variant="subtitle1">{estabelecimento.nome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Processo: {estabelecimento.numeroProcesso}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Empresa: {estabelecimento.empresa.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        NIF: {estabelecimento.empresa.nif} | Tel: {estabelecimento.empresa.tel1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {estabelecimento.provincia}, {estabelecimento.municipio}, {estabelecimento.bairro}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rua: {estabelecimento.rua}
                      </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Segunda linha - Nome, NIF/BI, Email */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Nome"
            name="nome"
            value={formData.nome || ''}
            onChange={handleChange}
            error={!!errors.nome}
            helperText={errors.nome || 'Nome completo do remetente'}
            inputProps={{
              minLength: 3,
              maxLength: 100
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="NIF/BI"
            name="nifBi"
            value={formData.nifBi || ''}
            onChange={(e) => {
              let value = e.target.value;
              // Permite apenas números e letras
              value = value.replace(/[^A-Za-z0-9]/g, '');
              // Limita a 9 caracteres
              value = value.slice(0, 9);
              // Atualiza o valor
              handleChange({
                target: { name: 'nifBi', value }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            error={!!errors.nifBi}
            helperText={errors.nifBi || 'Digite o NIF ou BI (9 caracteres)'}
            inputProps={{
              maxLength: 9
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleChange({
                target: { name: 'email', value }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            error={!!errors.email}
            helperText={errors.email || 'Digite um email válido'}
          />
        </Grid>
      </Grid>

      {/* Terceira linha - Telefone, Província, Município */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Telefone"
            name="tel"
            value={formData.tel || ''}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '').slice(0, 9);
              handleChange({
                target: { name: 'tel', value }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            error={!!errors.tel}
            helperText={errors.tel || 'Digite 9 dígitos'}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 9,
              pattern: '[0-9]*'
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required error={!!errors.provincia}>
            <InputLabel>Província</InputLabel>
            <Select
              name="provincia"
              value={formData.provincia}
              onChange={handleSelectChange}
              label="Província"
            >
              <MenuItem value="">Selecione uma província</MenuItem>
              {provincias.map((provincia) => (
                <MenuItem key={provincia._id} value={provincia.designacao}>
                  {provincia.designacao}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.provincia || 'Selecione a província'}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required error={!!errors.municipio}>
            <InputLabel>Município</InputLabel>
            <Select
              name="municipio"
              value={formData.municipio}
              onChange={handleSelectChange}
              label="Município"
              disabled={!formData.provincia}
            >
              <MenuItem value="">Selecione um município</MenuItem>
              {municipios.map((municipio) => (
                <MenuItem key={municipio._id} value={municipio.designacao}>
                  {municipio.designacao}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.municipio || 'Selecione o município'}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/* Quarta linha - Bairro (ocupando apenas 1/3 da largura) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            error={!!errors.bairro}
            helperText={errors.bairro || 'Digite o nome do bairro'}
            inputProps={{
              minLength: 2,
              maxLength: 50
            }}
          />
        </Grid>
      </Grid>

      {/* Quinta linha - Justificativa (campo grande ocupando toda a largura) */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Justificativa"
            name="justificativa"
            multiline
            rows={4}
            value={formData.justificativa}
            onChange={handleChange}
            error={!!errors.justificativa}
            helperText={errors.justificativa || 'Descreva o motivo da solicitação'}
            inputProps={{
              minLength: 10,
              maxLength: 500
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export { Step1DadosRemetente };