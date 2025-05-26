import { Box, Grid, Typography, TextField, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, MenuItem } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import BusinessIcon from '@material-ui/icons/Business';
import CheckIcon from '@material-ui/icons/Check';
import PersonIcon from '@material-ui/icons/Person';
import api from '../../../../../services/api';

const useStyles = makeStyles({
  gridItem: { margin: 8 },
  searchPaper: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef'
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#85287e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#6d1f65'
    }
  },
  estabelecimentosList: {
    maxHeight: 200,
    overflow: 'auto',
    marginTop: 8
  },
  estabelecimentoItem: {
    border: '1px solid #e0e0e0',
    marginBottom: 4,
    borderRadius: 4,
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  estabelecimentoSelecionado: {
    backgroundColor: '#e8f5e8',
    border: '1px solid #4caf50'
  },
  searchTitle: {
    marginBottom: 12,
    fontWeight: 500,
    color: '#85287e'
  },
  sectionDivider: {
    margin: '24px 0 16px 0',
    color: '#85287e',
    fontWeight: 500,
    borderBottom: '2px solid #85287e',
    paddingBottom: 8
  }
});

export interface StepDadosRequerenteProps {
  tipoSolicitante: string;
}

interface FormData {
  // Dados do estabelecimento
  estabelecimentoId?: string;
  nome: string;
  nifBi?: string;
  email: string;
  tel?: string;
  provincia?: string;
  municipio?: string;
  bairro?: string;
  endereco: string;
  
  // Dados específicos por tipo
  numeroRegistro: string;
  nif?: string;
  licencaComercial?: string;
  numeroProcesso?: string;
  registroComercial?: string;
  nomeRepresentante?: string;
  estabelecimentoNome?: string;
  
  // Dados do solicitante (pessoa que está fazendo a solicitação)
  remetidoPorNome: string;
  remetidoPorTel: string;
  remetidoPorBi: string;
  remetidoPorEmail: string;
  remetidoPorDataNascimento: string;
  remetidoPorGenero: string;
}

interface EstabelecimentoAPI {
  estabelecimentoId: string;
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
  userId: string;
}

interface Estabelecimento {
  _id: string;
  nome: string;
  provincia: string;
  municipio: string;
  bairro: string;
  rua?: string;
  numeroProcesso?: string;
  numeroEntrada?: number;
  status?: string;
  tipo?: string | null;
  approved?: boolean;
  nif: string;
  nifBi?: string;
  telefone: string;
  tel?: string;
  email: string;
  empresa?: {
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
  directorTecnico?: {
    dadosPessoais: {
      nome: string;
      email: string;
      tel1: string;
    };
  };
}

const DadosRequerente: React.FC<StepDadosRequerenteProps> = ({ tipoSolicitante }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    numeroRegistro: '',
    endereco: '',
    email: '',
    remetidoPorNome: '',
    remetidoPorTel: '',
    remetidoPorBi: '',
    remetidoPorEmail: '',
    remetidoPorDataNascimento: '',
    remetidoPorGenero: ''
  });

  const [pesquisaEstabelecimento, setPesquisaEstabelecimento] = useState('');
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState<Estabelecimento | null>(null);
  const [buscandoEstabelecimentos, setBuscandoEstabelecimentos] = useState(false);
  const [erroApi, setErroApi] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePesquisaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setPesquisaEstabelecimento(valor);
  };

  // Função para converter dados da API para formato interno
  const convertApiDataToEstabelecimento = (apiData: EstabelecimentoAPI): Estabelecimento => {
    return {
      _id: apiData.estabelecimentoId,
      nome: apiData.nome,
      provincia: apiData.provincia,
      municipio: apiData.municipio,
      bairro: apiData.bairro,
      nif: apiData.nifBi,
      nifBi: apiData.nifBi,
      telefone: apiData.tel,
      tel: apiData.tel,
      email: apiData.email,
      status: 'Activo',
      approved: true,
      empresa: {
        _id: apiData.estabelecimentoId,
        nome: apiData.nome,
        nif: apiData.nifBi,
        tel1: apiData.tel,
        provincia: apiData.provincia,
        municipio: apiData.municipio,
        bairro: apiData.bairro,
        rua: '',
        representante: apiData.remetidoPorNome
      }
    };
  };

  const pesquisarEstabelecimentos = async () => {
    if (!pesquisaEstabelecimento.trim()) return;
    
    console.log('DEBUG - Tipo Solicitante:', tipoSolicitante);
    console.log('DEBUG - Pesquisando por:', pesquisaEstabelecimento);
    
    setBuscandoEstabelecimentos(true);
    setErroApi('');
    
    try {
      let response;
      let estabelecimentosEncontrados: Estabelecimento[] = [];

      // Método 1: Endpoint de busca original
      try {
        const payload = {
          search: pesquisaEstabelecimento.trim()
        };
        
        response = await api.post('/estabelecimento/search', payload);
        console.log('📦 DEBUG - Resposta método 1:', response.data);
        
        if (response.data && response.data.estabelecimentos && Array.isArray(response.data.estabelecimentos)) {
          estabelecimentosEncontrados = response.data.estabelecimentos.filter((est: any) =>
            est.approved && est.status === 'Activo'
          );
        }
      } catch (error1) {
        console.log('Método 1 falhou, tentando método 2');
        
        // Método 2: Buscar pela estrutura de dados da API
        try {
          response = await api.get(`/estabelecimento/buscar/${pesquisaEstabelecimento.trim()}`);
          console.log('📦 DEBUG - Resposta método 2:', response.data);
          
          if (response.data && response.data.estabelecimentoId) {
            const estabelecimento = convertApiDataToEstabelecimento(response.data as EstabelecimentoAPI);
            estabelecimentosEncontrados = [estabelecimento];
          }
        } catch (error2) {
          console.log('Método 2 falhou, tentando método 3');
          
          // Método 3: Lista todos e filtra localmente
          try {
            response = await api.get('/estabelecimento/list');
            console.log('📦 DEBUG - Resposta método 3:', response.data);
            
            if (response.data && Array.isArray(response.data)) {
              const termo = pesquisaEstabelecimento.toLowerCase();
              estabelecimentosEncontrados = response.data
                .filter((item: any) => {
                  if (item.estabelecimentoId && item.nome && item.nifBi) {
                    return item.nome.toLowerCase().includes(termo) || 
                           item.nifBi.includes(termo);
                  }
                  return (item.nome && item.nome.toLowerCase().includes(termo)) ||
                         (item.empresa && item.empresa.nome && item.empresa.nome.toLowerCase().includes(termo)) ||
                         (item.empresa && item.empresa.nif && item.empresa.nif.includes(termo));
                })
                .map((item: any) => {
                  if (item.estabelecimentoId && item.nome && item.nifBi) {
                    return convertApiDataToEstabelecimento(item as EstabelecimentoAPI);
                  }
                  return item;
                })
                .filter((est: Estabelecimento) => est.approved !== false && est.status !== 'Inativo');
            }
          } catch (error3) {
            throw error1;
          }
        }
      }

      console.log('📦 DEBUG - Estabelecimentos encontrados:', estabelecimentosEncontrados);
      
      setEstabelecimentos(estabelecimentosEncontrados);
      
      if (estabelecimentosEncontrados.length === 0) {
        setErroApi('Nenhum estabelecimento ativo encontrado com os critérios de pesquisa.');
      }
      
    } catch (error: any) {
      console.error('Erro na pesquisa:', error);
      setErroApi(error.response?.data?.message || 'Erro ao buscar estabelecimentos. Tente novamente.');
      setEstabelecimentos([]);
    } finally {
      setBuscandoEstabelecimentos(false);
    }
  };

  const selecionarEstabelecimento = (estabelecimento: Estabelecimento) => {
    setEstabelecimentoSelecionado(estabelecimento);
    
    // Construir endereço completo usando os campos da API
    const enderecoCompleto = estabelecimento.empresa 
      ? `${estabelecimento.empresa.rua || ''}, ${estabelecimento.empresa.bairro}, ${estabelecimento.empresa.municipio}, ${estabelecimento.empresa.provincia}`.replace(/^, /, '')
      : `${estabelecimento.bairro}, ${estabelecimento.municipio}, ${estabelecimento.provincia}`;
    
    // Preencher automaticamente os campos do formulário com dados do estabelecimento
    // Apenas preenche se o campo atual estiver vazio ou se o dado da API não estiver vazio
    const novoFormData = {
      ...formData,
      // Dados do estabelecimento da API - preenche apenas se disponível
      estabelecimentoId: estabelecimento._id,
      nome: estabelecimento.nome || formData.nome,
      nifBi: estabelecimento.nifBi || estabelecimento.nif || formData.nifBi,
      email: estabelecimento.email || formData.email,
      tel: estabelecimento.tel || estabelecimento.telefone || formData.tel,
      provincia: estabelecimento.provincia || formData.provincia,
      municipio: estabelecimento.municipio || formData.municipio,
      bairro: estabelecimento.bairro || formData.bairro,
      endereco: enderecoCompleto || formData.endereco,
      estabelecimentoNome: estabelecimento.nome || formData.estabelecimentoNome,
      
      // Campos específicos baseados na estrutura existente - preenche apenas se disponível
      nif: estabelecimento.nifBi || estabelecimento.nif || formData.nif,
      licencaComercial: estabelecimento.numeroProcesso || formData.licencaComercial,
      numeroProcesso: estabelecimento.numeroProcesso || formData.numeroProcesso,
      registroComercial: estabelecimento.numeroProcesso || formData.registroComercial,
    };
    
    setFormData(novoFormData);

    // Limpar a pesquisa
    setPesquisaEstabelecimento('');
    setEstabelecimentos([]);
    setErroApi('');
  };

  const limparSelecao = () => {
    setEstabelecimentoSelecionado(null);
    setFormData(prev => ({
      ...prev,
      estabelecimentoId: '',
      nome: '',
      nifBi: '',
      email: '',
      tel: '',
      provincia: '',
      municipio: '',
      bairro: '',
      endereco: '',
      nif: '',
      licencaComercial: '',
      numeroProcesso: '',
      registroComercial: '',
      estabelecimentoNome: ''
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'dadosSolicitante',
      payload: { dadosSolicitante: formData }
    });
  }, [formData, dispatch]);

  // Mostrar pesquisa apenas para tipos empresariais
  const mostrarPesquisaEstabelecimento = ['distribuidor', 'importador', 'pessoaColetiva'].includes(tipoSolicitante);

  const renderCamposEspecificos = () => {
    switch (tipoSolicitante) {
      case 'distribuidor':
        return (
          <>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="NIF"
                fullWidth
                size="small"
                name="nif"
                variant="outlined"
                onChange={handleChange}
                value={formData.nif || ''}
                disabled={!!estabelecimentoSelecionado}
              />
            </Grid>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Licença Comercial / Número do Processo"
                fullWidth
                size="small"
                name="licencaComercial"
                variant="outlined"
                onChange={handleChange}
                value={formData.licencaComercial || ''}
                disabled={!!estabelecimentoSelecionado}
              />
            </Grid>
          </>
        );

      case 'importador':
        return (
          <>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="NIF"
                fullWidth
                size="small"
                name="nif"
                variant="outlined"
                onChange={handleChange}
                value={formData.nif || ''}
                disabled={!!estabelecimentoSelecionado}
              />
            </Grid>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Alvará / Número do Processo"
                fullWidth
                size="small"
                name="numeroProcesso"
                variant="outlined"
                onChange={handleChange}
                value={formData.numeroProcesso || ''}
                disabled={!!estabelecimentoSelecionado}
              />
            </Grid>
          </>
        );

      case 'pessoaColetiva':
        return (
          <>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Registro Comercial"
                fullWidth
                size="small"
                name="registroComercial"
                variant="outlined"
                onChange={handleChange}
                value={formData.registroComercial || ''}
                disabled={!!estabelecimentoSelecionado}
              />
            </Grid>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Nome do Representante Legal"
                fullWidth
                size="small"
                name="nomeRepresentante"
                variant="outlined"
                onChange={handleChange}
                value={formData.nomeRepresentante || ''}
              />
            </Grid>
          </>
        );

      case 'pessoaSingular':
        return (
          <Grid xs={12} md item className={classes.gridItem}>
            <TextField
              required
              type="text"
              label="NIF"
              fullWidth
              size="small"
              name="nif"
              variant="outlined"
              onChange={handleChange}
              value={formData.nif || ''}
            />
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" style={{ margin: 15 }}>
        DADOS DO REQUERENTE
      </Typography>

      {/* Seção de Pesquisa de Estabelecimentos */}
      {mostrarPesquisaEstabelecimento && (
        <Paper className={classes.searchPaper}>
          <Typography variant="h6" className={classes.searchTitle}>
            <BusinessIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Pesquisar Estabelecimento Registrado
          </Typography>
          
          {estabelecimentoSelecionado ? (
            <Box>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
                Estabelecimento selecionado (você pode editar os campos abaixo):
              </Typography>
              <Paper className={`${classes.estabelecimentoItem} ${classes.estabelecimentoSelecionado}`}>
                <ListItem>
                  <CheckIcon style={{ color: '#4caf50', marginRight: 8 }} />
                  <ListItemText
                    primary={estabelecimentoSelecionado.nome}
                    secondary={
                      <div>
                        <div><strong>NIF/BI:</strong> {estabelecimentoSelecionado.nifBi || estabelecimentoSelecionado.nif}</div>
                        <div><strong>Email:</strong> {estabelecimentoSelecionado.email}</div>
                        <div><strong>Telefone:</strong> {estabelecimentoSelecionado.tel || estabelecimentoSelecionado.telefone}</div>
                        <div><strong>Localização:</strong> {estabelecimentoSelecionado.bairro}, {estabelecimentoSelecionado.municipio}, {estabelecimentoSelecionado.provincia}</div>
                      </div>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      onClick={limparSelecao}
                      style={{ color: '#f44336' }}
                    >
                      Alterar
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            </Box>
          ) : (
            <Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  placeholder="Digite o Nome da Empresa, NIF, ou Número de Processo..."
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={pesquisaEstabelecimento}
                  onChange={handlePesquisaChange}
                  onKeyPress={(e) => e.key === 'Enter' && pesquisarEstabelecimentos()}
                />
                <Button
                  className={classes.searchButton}
                  variant="contained"
                  onClick={pesquisarEstabelecimentos}
                  disabled={buscandoEstabelecimentos || !pesquisaEstabelecimento.trim()}
                  startIcon={<SearchIcon />}
                >
                  {buscandoEstabelecimentos ? 'Buscando...' : 'Buscar'}
                </Button>
              </Box>

              {erroApi && (
                <Typography variant="body2" color="error" style={{ marginTop: 8 }}>
                  {erroApi}
                </Typography>
              )}

              {estabelecimentos.length > 0 && (
                <Box className={classes.estabelecimentosList}>
                  <Typography variant="body2" style={{ margin: '8px 0', fontWeight: 500 }}>
                    Resultados encontrados ({estabelecimentos.length}):
                  </Typography>
                  {estabelecimentos.map((estabelecimento) => (
                    <Paper key={estabelecimento._id} className={classes.estabelecimentoItem}>
                      <ListItem button onClick={() => selecionarEstabelecimento(estabelecimento)}>
                        <BusinessIcon style={{ marginRight: 8, color: '#85287e' }} />
                        <ListItemText
                          primary={estabelecimento.nome}
                          secondary={
                            <div>
                              <div><strong>NIF/BI:</strong> {estabelecimento.nifBi || estabelecimento.nif}</div>
                              <div><strong>Email:</strong> {estabelecimento.email}</div>
                              <div><strong>Telefone:</strong> {estabelecimento.tel || estabelecimento.telefone}</div>
                              <div><strong>Localização:</strong> {estabelecimento.bairro}, {estabelecimento.municipio}, {estabelecimento.provincia}</div>
                            </div>
                          }
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </Box>
              )}

              <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                Ou preencha manualmente os campos abaixo se o estabelecimento não for encontrado.
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Dados do Estabelecimento/Empresa */}
      <Typography variant="h6" className={classes.sectionDivider}>
        <BusinessIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Dados do Estabelecimento/Empresa
      </Typography>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Nome da Empresa/Estabelecimento"
            fullWidth
            size="small"
            name="nome"
            variant="outlined"
            onChange={handleChange}
            value={formData.nome}
            helperText={estabelecimentoSelecionado ? "Dados carregados do estabelecimento - você pode editar se necessário" : ""}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="email"
            label="Email"
            fullWidth
            size="small"
            name="email"
            variant="outlined"
            onChange={handleChange}
            value={formData.email}
            helperText={estabelecimentoSelecionado ? "Dados carregados do estabelecimento - você pode editar se necessário" : ""}
          />
        </Grid>
      </Grid>

      <Grid container>
        {renderCamposEspecificos()}
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Endereço"
            fullWidth
            size="small"
            name="endereco"
            variant="outlined"
            onChange={handleChange}
            value={formData.endereco}
            disabled={!!estabelecimentoSelecionado}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            type="tel"
            label="Telefone"
            fullWidth
            size="small"
            name="tel"
            variant="outlined"
            onChange={handleChange}
            value={formData.tel || ''}
            disabled={!!estabelecimentoSelecionado}
          />
        </Grid>
      </Grid>

      {/* Dados do Solicitante */}
      <Typography variant="h6" className={classes.sectionDivider}>
        <PersonIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Dados de Quem Está Fazendo a Solicitação
      </Typography>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Nome Completo do Solicitante"
            fullWidth
            size="small"
            name="remetidoPorNome"
            variant="outlined"
            onChange={handleChange}
            value={formData.remetidoPorNome}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="date"
            label="Data de Nascimento"
            fullWidth
            size="small"
            name="remetidoPorDataNascimento"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={formData.remetidoPorDataNascimento}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            select
            label="Gênero"
            fullWidth
            size="small"
            name="remetidoPorGenero"
            variant="outlined"
            onChange={handleChange}
            value={formData.remetidoPorGenero}
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Outro">Outro</MenuItem>
          </TextField>
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="BI/Número de Identificação"
            fullWidth
            size="small"
            name="remetidoPorBi"
            variant="outlined"
            onChange={handleChange}
            value={formData.remetidoPorBi}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="tel"
            label="Telefone do Solicitante"
            fullWidth
            size="small"
            name="remetidoPorTel"
            variant="outlined"
            onChange={handleChange}
            value={formData.remetidoPorTel}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="email"
            label="Email do Solicitante"
            fullWidth
            size="small"
            name="remetidoPorEmail"
            variant="outlined"
            onChange={handleChange}
            value={formData.remetidoPorEmail}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DadosRequerente;