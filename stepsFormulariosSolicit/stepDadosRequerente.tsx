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
  alvara?: string;
  registroComercial?: string;
  nomeRepresentante?: string;
  estabelecimentoId?: string;
  estabelecimentoNome?: string;
}

interface Estabelecimento {
  _id: string;
  nome: string;
  provincia: string;
  municipio: string;
  bairro: string;
  rua: string;
  numeroProcesso: string;
  numeroEntrada: number;
  status: string;
  tipo: string | null;
  approved: boolean;
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
    setPesquisaEstabelecimento(e.target.value);
  };

  const pesquisarEstabelecimentos = async () => {
    if (!pesquisaEstabelecimento.trim()) return;

    setBuscandoEstabelecimentos(true);
    setErroApi('');
    
    try {
      const response = await api.get('/estabelecimentos');
      
      if (response.data && Array.isArray(response.data)) {
        console.log("daods:", response)
        // Filtrar estabelecimentos baseado na pesquisa
        const resultados = response.data.filter((est: Estabelecimento) => {
          const termoPesquisa = pesquisaEstabelecimento.toLowerCase();
          return (
            est.nome.toLowerCase().includes(termoPesquisa) ||
            est.empresa.nome.toLowerCase().includes(termoPesquisa) ||
            est.empresa.nif.includes(pesquisaEstabelecimento) ||
            est.numeroProcesso.toLowerCase().includes(termoPesquisa)
          ) && est.approved && est.status === 'Activo'; // Apenas estabelecimentos aprovados e ativos
        });
        
        setEstabelecimentos(resultados);
        console.log("daods:", resultados)
        
        if (resultados.length === 0) {
          setErroApi('Nenhum estabelecimento encontrado com os critérios de pesquisa.');
        }
      } else {
        setErroApi('Formato de resposta inválido da API.');
      }
    } catch (error: any) {
      console.error('Erro ao buscar estabelecimentos:', error);
      setErroApi(error.response?.data?.message || 'Erro ao buscar estabelecimentos. Tente novamente.');
      setEstabelecimentos([]);
    } finally {
      setBuscandoEstabelecimentos(false);
    }
  };

  const selecionarEstabelecimento = (estabelecimento: Estabelecimento) => {
    setEstabelecimentoSelecionado(estabelecimento);
    
    // Construir endereço completo
    const enderecoCompleto = `${estabelecimento.empresa.rua}, ${estabelecimento.empresa.bairro}, ${estabelecimento.empresa.municipio}, ${estabelecimento.empresa.provincia}`;
    
    // Preencher automaticamente os campos do formulário com dados da empresa
    setFormData(prev => ({
      ...prev,
      nome: estabelecimento.empresa.nome,
      endereco: enderecoCompleto,
      nif: estabelecimento.empresa.nif,
      telefone: estabelecimento.empresa.tel1 || '',
      email: estabelecimento.directorTecnico?.dadosPessoais?.email || '',
      licencaComercial: estabelecimento.numeroProcesso || '',
      alvara: estabelecimento.numeroProcesso || '',
      registroComercial: estabelecimento.numeroProcesso || '',
      estabelecimentoId: estabelecimento._id,
      estabelecimentoNome: estabelecimento.nome
    }));

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
      alvara: '',
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
                name="alvara"
                variant="outlined"
                onChange={handleChange}
                value={formData.alvara || ''}
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
                        <div><strong>Empresa:</strong> {estabelecimentoSelecionado.empresa.nome}</div>
                        <div><strong>NIF:</strong> {estabelecimentoSelecionado.empresa.nif}</div>
                        <div><strong>Localização:</strong> {estabelecimentoSelecionado.empresa.municipio}, {estabelecimentoSelecionado.empresa.provincia}</div>
                        <div><strong>Processo:</strong> {estabelecimentoSelecionado.numeroProcesso}</div>
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
                  placeholder="Digite o nome do estabelecimento, empresa ou NIF..."
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
                              <div><strong>Empresa:</strong> {estabelecimento.empresa.nome}</div>
                              <div><strong>NIF:</strong> {estabelecimento.empresa.nif}</div>
                              <div><strong>Localização:</strong> {estabelecimento.empresa.municipio}, {estabelecimento.empresa.provincia}</div>
                              <div><strong>Processo:</strong> {estabelecimento.numeroProcesso}</div>
                              <div><strong>Status:</strong> {estabelecimento.status}</div>
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