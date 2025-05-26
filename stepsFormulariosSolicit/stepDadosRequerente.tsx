import { Box, Grid, Typography, TextField, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import BusinessIcon from '@material-ui/icons/Business';
import CheckIcon from '@material-ui/icons/Check';
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
  }
});

export interface StepDadosRequerenteProps {
  tipoSolicitante: string;
}

interface FormData {
  nome: string;
  dataNascimento: string;
  genero: string;
  numeroRegistro: string;
  endereco: string;
  telefone: string;
  email: string;
  nif?: string;
  licencaComercial?: string;
  numeroProcesso?: string;
  registroComercial?: string;
  nomeRepresentante?: string;
  estabelecimentoId?: string;
  estabelecimentoNome?: string;
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
  telefone: string;
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
    dataNascimento: '',
    genero: '',
    numeroRegistro: '',
    endereco: '',
    telefone: '',
    email: ''
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
      telefone: apiData.tel,
      email: apiData.email,
      status: 'Activo', // Assumindo que dados retornados estão ativos
      approved: true, // Assumindo que dados retornados estão aprovados
      empresa: {
        _id: apiData.estabelecimentoId,
        nome: apiData.nome,
        nif: apiData.nifBi,
        tel1: apiData.tel,
        provincia: apiData.provincia,
        municipio: apiData.municipio,
        bairro: apiData.bairro,
        rua: '', // Não disponível na API atual
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
      // Tentar diferentes endpoints e formatos
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
        
        // Método 2: Buscar pela estrutura de dados mostrada na imagem
        try {
          // Se a estrutura da API retorna um objeto com chaves como na imagem
          response = await api.get(`/estabelecimento/buscar/${pesquisaEstabelecimento.trim()}`);
          console.log('📦 DEBUG - Resposta método 2:', response.data);
          
          // Se retornar um único objeto
          if (response.data && response.data.estabelecimentoId) {
            const estabelecimento = convertApiDataToEstabelecimento(response.data as EstabelecimentoAPI);
            estabelecimentosEncontrados = [estabelecimento];
          }
        } catch (error2) {
          console.log('Método 2 falhou, tentando método 3');
          
          // Método 3: Lista todos e filtra localmente (use com cuidado)
          try {
            response = await api.get('/estabelecimento/list');
            console.log('📦 DEBUG - Resposta método 3:', response.data);
            
            if (response.data && Array.isArray(response.data)) {
              const termo = pesquisaEstabelecimento.toLowerCase();
              estabelecimentosEncontrados = response.data
                .filter((item: any) => {
                  // Verifica se tem a estrutura da API mostrada na imagem
                  if (item.estabelecimentoId && item.nome && item.nifBi) {
                    return item.nome.toLowerCase().includes(termo) || 
                           item.nifBi.includes(termo);
                  }
                  // Ou se tem a estrutura tradicional
                  return (item.nome && item.nome.toLowerCase().includes(termo)) ||
                         (item.empresa && item.empresa.nome && item.empresa.nome.toLowerCase().includes(termo)) ||
                         (item.empresa && item.empresa.nif && item.empresa.nif.includes(termo));
                })
                .map((item: any) => {
                  // Converter se for o formato da API
                  if (item.estabelecimentoId && item.nome && item.nifBi) {
                    return convertApiDataToEstabelecimento(item as EstabelecimentoAPI);
                  }
                  return item;
                })
                .filter((est: Estabelecimento) => est.approved !== false && est.status !== 'Inativo');
            }
          } catch (error3) {
            throw error1; // Throw original error if all methods fail
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
    
    // Construir endereço completo
    const enderecoCompleto = estabelecimento.empresa 
      ? `${estabelecimento.empresa.rua || ''}, ${estabelecimento.empresa.bairro}, ${estabelecimento.empresa.municipio}, ${estabelecimento.empresa.provincia}`.replace(/^, /, '')
      : `${estabelecimento.bairro}, ${estabelecimento.municipio}, ${estabelecimento.provincia}`;
    
    // Preencher automaticamente os campos do formulário
    const novoFormData = {
      ...formData,
      nome: estabelecimento.empresa?.nome || estabelecimento.nome,
      endereco: enderecoCompleto,
      nif: estabelecimento.empresa?.nif || estabelecimento.nif,
      telefone: estabelecimento.empresa?.tel1 || estabelecimento.telefone || '',
      email: estabelecimento.directorTecnico?.dadosPessoais?.email || estabelecimento.email || '',
      licencaComercial: estabelecimento.numeroProcesso || '',
      numeroProcesso: estabelecimento.numeroProcesso || '',
      registroComercial: estabelecimento.numeroProcesso || '',
      estabelecimentoId: estabelecimento._id,
      estabelecimentoNome: estabelecimento.nome
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
      nome: '',
      endereco: '',
      nif: '',
      telefone: '',
      email: '',
      licencaComercial: '',
      numeroProcesso: '',
      registroComercial: '',
      estabelecimentoId: '',
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
        DADOS DO SOLICITANTE
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
                Estabelecimento selecionado:
              </Typography>
              <Paper className={`${classes.estabelecimentoItem} ${classes.estabelecimentoSelecionado}`}>
                <ListItem>
                  <CheckIcon style={{ color: '#4caf50', marginRight: 8 }} />
                  <ListItemText
                    primary={estabelecimentoSelecionado.nome}
                    secondary={
                      <div>
                        <div><strong>Empresa:</strong> {estabelecimentoSelecionado.empresa?.nome || estabelecimentoSelecionado.nome}</div>
                        <div><strong>NIF:</strong> {estabelecimentoSelecionado.empresa?.nif || estabelecimentoSelecionado.nif}</div>
                        <div><strong>Localização:</strong> {estabelecimentoSelecionado.municipio}, {estabelecimentoSelecionado.provincia}</div>
                        {estabelecimentoSelecionado.numeroProcesso && (
                          <div><strong>Processo:</strong> {estabelecimentoSelecionado.numeroProcesso}</div>
                        )}
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
                              <div><strong>Empresa:</strong> {estabelecimento.empresa?.nome || estabelecimento.nome}</div>
                              <div><strong>NIF:</strong> {estabelecimento.empresa?.nif || estabelecimento.nif}</div>
                              <div><strong>Localização:</strong> {estabelecimento.municipio}, {estabelecimento.provincia}</div>
                              <div><strong>Email:</strong> {estabelecimento.email}</div>
                              <div><strong>Telefone:</strong> {estabelecimento.telefone}</div>
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

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Nome Completo"
            fullWidth
            size="small"
            name="nome"
            variant="outlined"
            onChange={handleChange}
            value={formData.nome}
            disabled={!!estabelecimentoSelecionado}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="date"
            label="Data de Nascimento"
            fullWidth
            size="small"
            name="dataNascimento"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={formData.dataNascimento}
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
            required
            type="tel"
            label="Telefone"
            fullWidth
            size="small"
            name="telefone"
            variant="outlined"
            onChange={handleChange}
            value={formData.telefone}
          />
        </Grid>
      </Grid>

      <Grid container>
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
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DadosRequerente;