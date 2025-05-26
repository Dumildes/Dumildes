import { useState, useEffect } from 'react';
import { Card, Container, Box, Typography, Stepper, Step, StepLabel, Divider, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
import InformacoesSolicitante from './stepsFormulariosSolicit/stepDadosRequerente';
import InformacoesMedicamento from './stepsFormulariosSolicit/stepInformacoesMedicamento';
import InformacoesJustificativa from './stepsFormulariosSolicit/stepJustificativa';
import StepDocumentos from './stepsFormulariosSolicit/stepDocumentos';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSession from '../../../../utils/headerSession';
import RegisterAccess from '../../../../utils/registerAccess';
import api from '../../../../services/api';

// Interfaces para tipagem
interface DadosSolicitante {
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

interface Produto {
  id: string;
  tipo: 'medicamento' | 'tecnologia';
  dados: any;
}

interface DocumentoAnexado {
  id: string;
  nome: string;
  arquivo: File;
  tipo: 'documento1' | 'documento2' | 'documento3';
}

interface FormState {
  dadosSolicitante: DadosSolicitante | null;
  produtos: Produto[];
  dadosJustificativa: { justificativa: string } | null;
  dadosDocumentos: {
    documento1: DocumentoAnexado | null;
    documento2: DocumentoAnexado | null;
    documento3: DocumentoAnexado | null;
  } | null;
}

export default function FormularioAnaliseLaboratorial() {
  const dispatch = useDispatch();
  const reduxState = useSelector((state: any) => state);
  
  const [activeStep, setActiveStep] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tipoSolicitante, setTipoSolicitante] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Estado local para armazenar dados do formulário
  const [formState, setFormState] = useState<FormState>({
    dadosSolicitante: null,
    produtos: [],
    dadosJustificativa: null,
    dadosDocumentos: null
  });

  const steps = [
    'Informações do Solicitante',
    'Informações do Produto',
    'Justificativa para a Análise',
    'Anexar Documentos'
  ];

  // Atualizar estado local quando Redux state mudar
  useEffect(() => {
    console.log('Redux State:', reduxState); // Debug log
    
    const newFormState = {
      dadosSolicitante: reduxState.dadosSolicitante || null,
      produtos: [
        ...(reduxState.dadosMedicamento ? [{
          id: 'medicamento_1',
          tipo: 'medicamento' as const,
          dados: reduxState.dadosMedicamento
        }] : []),
        ...(reduxState.dadosTecnologiaSaude ? [{
          id: 'tecnologia_1',
          tipo: 'tecnologia' as const,
          dados: reduxState.dadosTecnologiaSaude
        }] : [])
      ],
      dadosJustificativa: reduxState.dadosJustificativa || null,
      dadosDocumentos: reduxState.dadosDocumentos || null
    };

    console.log('New Form State:', newFormState); // Debug log
    
    setFormState(newFormState);
  }, [reduxState]);

  // Validações para cada step - usando diretamente o Redux state para validação em tempo real
  const validateStep = (stepIndex: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Usar Redux state diretamente para validação mais atual
    const currentDadosSolicitante = reduxState.dadosSolicitante;
    const currentProdutos = [
      ...(reduxState.dadosMedicamento ? [{
        id: 'medicamento_1',
        tipo: 'medicamento' as const,
        dados: reduxState.dadosMedicamento
      }] : []),
      ...(reduxState.dadosTecnologiaSaude ? [{
        id: 'tecnologia_1',
        tipo: 'tecnologia' as const,
        dados: reduxState.dadosTecnologiaSaude
      }] : [])
    ];
    const currentJustificativa = reduxState.dadosJustificativa;
    const currentDocumentos = reduxState.dadosDocumentos;

    switch (stepIndex) {
      case 0: // Dados do Solicitante
        console.log('Validating step 0 - currentDadosSolicitante:', currentDadosSolicitante); // Debug log
        
        if (!currentDadosSolicitante) {
          errors.push('Dados do solicitante são obrigatórios');
          break;
        }
        
        const { nome, dataNascimento, endereco, telefone, email } = currentDadosSolicitante;
        
        if (!nome?.trim()) errors.push('Nome é obrigatório');
        if (!dataNascimento) errors.push('Data de nascimento é obrigatória');
        if (!endereco?.trim()) errors.push('Endereço é obrigatório');
        if (!telefone?.trim()) errors.push('Telefone é obrigatório');
        if (!email?.trim()) errors.push('Email é obrigatório');
        
        // Validações específicas por tipo
        if (tipoSolicitante === 'distribuidor' || tipoSolicitante === 'importador') {
          if (!currentDadosSolicitante.nif?.trim()) errors.push('NIF é obrigatório');
          if (!currentDadosSolicitante.licencaComercial?.trim() && !currentDadosSolicitante.numeroProcesso?.trim()) {
            errors.push('Licença Comercial/Alvará é obrigatório');
          }
        }
        if (tipoSolicitante === 'pessoaColetiva') {
          if (!currentDadosSolicitante.registroComercial?.trim()) errors.push('Registro Comercial é obrigatório');
          if (!currentDadosSolicitante.nomeRepresentante?.trim()) errors.push('Nome do Representante é obrigatório');
        }
        if (tipoSolicitante === 'pessoaSingular') {
          if (!currentDadosSolicitante.nif?.trim()) errors.push('NIF é obrigatório');
        }
        break;

      case 1: // Informações do Produto
        if (currentProdutos.length === 0) {
          errors.push('Pelo menos um produto deve ser adicionado');
          break;
        }
        
        currentProdutos.forEach((produto, index) => {
          if (produto.tipo === 'medicamento') {
            const { nome, dosagem, formaFarmaceutica, fabricante, lote, dataFabrico, dataValidade } = produto.dados;
            if (!nome?.trim()) errors.push(`Produto ${index + 1}: Nome do medicamento é obrigatório`);
            if (!dosagem?.trim()) errors.push(`Produto ${index + 1}: Dosagem é obrigatória`);
            if (!formaFarmaceutica?.trim()) errors.push(`Produto ${index + 1}: Forma farmacêutica é obrigatória`);
            if (!fabricante?.trim()) errors.push(`Produto ${index + 1}: Fabricante é obrigatório`);
            if (!lote?.trim()) errors.push(`Produto ${index + 1}: Lote é obrigatório`);
            if (!dataFabrico) errors.push(`Produto ${index + 1}: Data de fabricação é obrigatória`);
            if (!dataValidade) errors.push(`Produto ${index + 1}: Data de validade é obrigatória`);
          } else if (produto.tipo === 'tecnologia') {
            const { nome, fabricante, lote, dataFabrico, dataValidade } = produto.dados;
            if (!nome?.trim()) errors.push(`Produto ${index + 1}: Nome do produto é obrigatório`);
            if (!fabricante?.trim()) errors.push(`Produto ${index + 1}: Fabricante é obrigatório`);
            if (!lote?.trim()) errors.push(`Produto ${index + 1}: Lote é obrigatório`);
            if (!dataFabrico) errors.push(`Produto ${index + 1}: Data de fabricação é obrigatória`);
            if (!dataValidade) errors.push(`Produto ${index + 1}: Data de validade é obrigatória`);
          }
        });
        break;

      case 2: // Justificativa
        if (!currentJustificativa?.justificativa?.trim()) {
          errors.push('Justificativa é obrigatória');
        }
        break;

      case 3: // Documentos
        if (!currentDocumentos) {
          errors.push('Documentos são obrigatórios');
          break;
        }
        
        const { documento1, documento2, documento3 } = currentDocumentos;
        if (!documento1) errors.push('BI é obrigatório');
        if (!documento2) errors.push('Factura do Medicamento é obrigatória');
        if (!documento3) errors.push('Cópia da Importação é obrigatória');
        break;
    }

    console.log('Validation result for step', stepIndex, ':', { isValid: errors.length === 0, errors }); // Debug log
    return { isValid: errors.length === 0, errors };
  };

  function getStepContent(stepIndex: number) {
    switch (stepIndex) { 
      case 0:
        return <InformacoesSolicitante tipoSolicitante={tipoSolicitante} />;
      case 1:
        return <InformacoesMedicamento />;
      case 2:
        return <InformacoesJustificativa />;
      case 3:
        return <StepDocumentos />;
      default:
        return null;
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      setActiveStep(-1);
      setTipoSolicitante('');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleNext = () => {
    // Limpar mensagem de erro anterior
    setErrorMessage('');
    
    // Pequeno delay para garantir que o Redux state foi atualizado
    setTimeout(() => {
      // Validar step atual antes de avançar
      const validation = validateStep(activeStep);
      
      if (!validation.isValid) {
        setErrorMessage(validation.errors.join(', '));
        return;
      }

      if (activeStep === steps.length - 1) {
        setShowConfirmDialog(true);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }, 100);
  };

  const handleTipoSolicitanteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoSolicitante(event.target.value);
  };

  const iniciarFormulario = () => {
    if (tipoSolicitante) {
      setActiveStep(0);
    }
  };

  const prepararDadosParaEnvio = () => {
    const formData = new FormData();
    
    // Usar dados atuais do Redux
    const currentDadosSolicitante = reduxState.dadosSolicitante;
    const currentProdutos = [
      ...(reduxState.dadosMedicamento ? [{
        id: 'medicamento_1',
        tipo: 'medicamento' as const,
        dados: reduxState.dadosMedicamento
      }] : []),
      ...(reduxState.dadosTecnologiaSaude ? [{
        id: 'tecnologia_1',
        tipo: 'tecnologia' as const,
        dados: reduxState.dadosTecnologiaSaude
      }] : [])
    ];
    const currentJustificativa = reduxState.dadosJustificativa;
    const currentDocumentos = reduxState.dadosDocumentos;
    
    // Dados do solicitante
    if (currentDadosSolicitante) {
      formData.append('tipoSolicitante', tipoSolicitante);
      formData.append('dadosSolicitante', JSON.stringify(currentDadosSolicitante));
    }
    
    // Produtos
    if (currentProdutos.length > 0) {
      formData.append('produtos', JSON.stringify(currentProdutos));
    }
    
    // Justificativa
    if (currentJustificativa) {
      formData.append('justificativa', currentJustificativa.justificativa);
    }
    
    // Documentos
    if (currentDocumentos) {
      if (currentDocumentos.documento1) {
        formData.append('documento1', currentDocumentos.documento1.arquivo);
      }
      if (currentDocumentos.documento2) {
        formData.append('documento2', currentDocumentos.documento2.arquivo);
      }
      if (currentDocumentos.documento3) {
        formData.append('documento3', currentDocumentos.documento3.arquivo);
      }
    }
    
    return formData;
  };

  const submitAnalise = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setErrorMessage('');
    
    try {
      const formData = prepararDadosParaEnvio();
      
      const response = await api.post('/solicitacao-analise/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccessMessage('Solicitação enviada com sucesso!');
      
      // Limpar formulário após sucesso
      setTimeout(() => {
        setActiveStep(-1);
        setTipoSolicitante('');
        setFormState({
          dadosSolicitante: null,
          produtos: [],
          dadosJustificativa: null,
          dadosDocumentos: null
        });
        
        // Limpar Redux state
        dispatch({ type: 'CLEAR_FORM' });
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao processar solicitação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepButtonText = () => {
    switch (activeStep) {
      case 0:
        return 'Próximo';
      case 1:
        return 'Próximo';
      case 2:
        return 'Anexar Documentos';
      case 3:
        return 'Enviar Solicitação';
      default:
        return 'Próximo';
    }
  };

  return (
    <Container style={{ marginBottom: 12, minHeight: "70vh" }}>
      <RegisterAccess page={'solicitação de analise laboratotial'} />
      <HeaderSession title='SOLICITAÇÃO DE ANÁLISE LABORATORIAL' />
      
      <Card style={{ marginBottom: 12, padding: 22 }}>
        {activeStep === -1 ? (
          <Box>
            <Typography variant="h6" style={{ marginBottom: 20 }}>
              Selecione o tipo de solicitante:
            </Typography>
            <Paper style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
              <FormControl component="fieldset">
                <RadioGroup
                  value={tipoSolicitante}
                  onChange={handleTipoSolicitanteChange}
                >
                  <FormControlLabel 
                    value="distribuidor" 
                    control={<Radio />} 
                    label="Distribuidor" 
                  />
                  <FormControlLabel 
                    value="importador" 
                    control={<Radio />} 
                    label="Importador" 
                  />
                  <FormControlLabel 
                    value="pessoaSingular" 
                    control={<Radio />} 
                    label="Pessoa Singular" 
                  />
                  <FormControlLabel 
                    value="pessoaColetiva" 
                    control={<Radio />} 
                    label="Pessoa Coletiva" 
                  />
                </RadioGroup>
              </FormControl>
              <Box style={{ marginTop: 20, textAlign: 'right' }}>
                <Button
                  style={{ background: '#85287e', width: 120 }}
                  variant="contained"
                  onClick={iniciarFormulario}
                  disabled={!tipoSolicitante}
                >
                  Continuar <NavigateNext />
                </Button>
              </Box>
            </Paper>
          </Box>
        ) : (
          <>
            <div style={{ overflow: 'auto' }}>
              <Stepper color="secondary" activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel style={{ color: '#85287e' }}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Divider />
            </div>

            <Box sx={{ marginTop: 6 }}>
              {getStepContent(activeStep)}
            </Box>

            {/* Exibir erros de validação */}
            {errorMessage && (
              <Alert severity="error" style={{ margin: '20px 0' }}>
                {errorMessage}
              </Alert>
            )}

            <div style={{ display: 'flex', margin: '20px 10px' }}>
              <Button
                style={{ background: '#ebebf4' }}
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
              >
                Voltar
              </Button>

              <Box style={{ display: 'flex', flexGrow: 1 }} />

              <Button
                style={{ background: '#85287e', width: 160 }}
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Enviando...' : getStepButtonText()} <NavigateNext />
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Dialog de Confirmação */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Envio</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja enviar esta solicitação de análise laboratorial?
            Após o envio, não será possível fazer alterações.
          </Typography>
          
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>Resumo:</Typography>
            <Typography variant="body2">• Solicitante: {reduxState.dadosSolicitante?.nome || 'N/A'}</Typography>
            <Typography variant="body2">• Produtos: {
              [
                ...(reduxState.dadosMedicamento ? [1] : []),
                ...(reduxState.dadosTecnologiaSaude ? [1] : [])
              ].length
            }</Typography>
            <Typography variant="body2">• Documentos anexados: {
              Object.values(reduxState.dadosDocumentos || {}).filter(doc => doc !== null).length
            }/3</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={submitAnalise}
            variant="contained"
            style={{ background: '#85287e' }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Confirmar Envio'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagem de sucesso */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}