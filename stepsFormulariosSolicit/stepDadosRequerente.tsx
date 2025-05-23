import { Box, Grid, Typography, TextField, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import BusinessIcon from '@material-ui/icons/Business';
import CheckIcon from '@material-ui/icons/Check';

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
  id: string;
  nome: string;
  endereco: string;
  nif: string;
  tipo: string;
  licenca?: string;
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

  // Dados mock para demonstração - em produção, viria de uma API
  const estabelecimentosMock: Estabelecimento[] = [
    {
      id: '1',
      nome: 'Farmácia Central Lda',
      endereco: 'Rua da Liberdade, 123, Luanda',
      nif: '5401234567',
      tipo: 'distribuidor',
      licenca: 'LC001234'
    },
    {
      id: '2',
      nome: 'MedImport Angola',
      endereco: 'Av. 4 de Fevereiro, 456, Luanda',
      nif: '5407654321',
      tipo: 'importador',
      licenca: 'IM005678'
    },
    {
      id: '3',
      nome: 'Distribuidora Saúde Plus',
      endereco: 'Rua Comandante Che Guevara, 789, Luanda',
      nif: '5409876543',
      tipo: 'distribuidor',
      licenca: 'LC009876'
    },
    {
      id: '4',
      nome: 'Pharma Solutions Lda',
      endereco: 'Rua Major Kanhangulo, 321, Luanda',
      nif: '5403456789',
      tipo: 'importador',
      licenca: 'IM003456'
    }
  ];

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
    
    // Simular delay de API
    setTimeout(() => {
      const resultados = estabelecimentosMock.filter(est => 
        est.nome.toLowerCase().includes(pesquisaEstabelecimento.toLowerCase()) ||
        est.nif.includes(pesquisaEstabelecimento) ||
        (tipoSolicitante !== 'pessoaSingular' && est.tipo === tipoSolicitante)
      );
      
      setEstabelecimentos(resultados);
      setBuscandoEstabelecimentos(false);
    }, 1000);
  };

  const selecionarEstabelecimento = (estabelecimento: Estabelecimento) => {
    setEstabelecimentoSelecionado(estabelecimento);
    
    // Preencher automaticamente os campos do formulário
    setFormData(prev => ({
      ...prev,
      nome: estabelecimento.nome,
      endereco: estabelecimento.endereco,
      nif: estabelecimento.nif,
      licencaComercial: estabelecimento.licenca || '',
      alvara: estabelecimento.licenca || '',
      estabelecimentoId: estabelecimento.id,
      estabelecimentoNome: estabelecimento.nome
    }));

    // Limpar a pesquisa
    setPesquisaEstabelecimento('');
    setEstabelecimentos([]);
  };

  const limparSelecao = () => {
    setEstabelecimentoSelecionado(null);
    setFormData(prev => ({
      ...prev,
      nome: '',
      endereco: '',
      nif: '',
      licencaComercial: '',
      alvara: '',
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
                label="Licença Comercial"
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
                label="Alvará"
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
                    secondary={`${estabelecimentoSelecionado.endereco} • NIF: ${estabelecimentoSelecionado.nif}`}
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
                  placeholder="Digite o nome do estabelecimento ou NIF..."
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

              {estabelecimentos.length > 0 && (
                <Box className={classes.estabelecimentosList}>
                  <Typography variant="body2" style={{ margin: '8px 0', fontWeight: 500 }}>
                    Resultados encontrados:
                  </Typography>
                  {estabelecimentos.map((estabelecimento) => (
                    <Paper key={estabelecimento.id} className={classes.estabelecimentoItem}>
                      <ListItem button onClick={() => selecionarEstabelecimento(estabelecimento)}>
                        <BusinessIcon style={{ marginRight: 8, color: '#85287e' }} />
                        <ListItemText
                          primary={estabelecimento.nome}
                          secondary={`${estabelecimento.endereco} • NIF: ${estabelecimento.nif} • Tipo: ${estabelecimento.tipo}`}
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