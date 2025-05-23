import { useState } from 'react';
import { Card, Container, Box, Typography, Stepper, Step, StepLabel, Divider, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
import InformacoesSolicitante from './stepsFormulariosSolicit/stepDadosRequerente';
import InformacoesMedicamento from './stepsFormulariosSolicit/stepInformacoesMedicamento';
import InformacoesJustificativa from './stepsFormulariosSolicit/stepJustificativa';
import StepDocumentos from './stepsFormulariosSolicit/stepDocumentos';
import { useDispatch } from 'react-redux';
import HeaderSession from '../../../../utils/headerSession';
import RegisterAccess from '../../../../utils/registerAccess';

export default function FormularioAnaliseLaboratorial() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(-1); // Começa em -1 para mostrar a seleção inicial
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [tipoSolicitante, setTipoSolicitante] = useState('');

  const steps = [
    'Informações do Solicitante',
    'Informações do Produto',
    'Justificativa para a Análise',
    'Anexar Documentos'
  ];

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
      setActiveStep(-1); // Volta para a seleção inicial
      setTipoSolicitante('');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleTipoSolicitanteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoSolicitante(event.target.value);
  };

  const iniciarFormulario = () => {
    if (tipoSolicitante) {
      setActiveStep(0);
    }
  };

  const submitAnalise = async () => {
    setOpen(true);
    try {
      // Implementar lógica de submissão
      console.log('Enviando formulário com documentos anexados...');
      setOpen(false);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Erro ao processar solicitação');
      setOpen(false);
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

            <Box sx={{marginTop: 6}}>{getStepContent(activeStep)}</Box>

            <div style={{ display: 'flex', margin: '20px 10px' }}>
              <Button
                style={{ background: '#ebebf4' }}
                variant="outlined"
                onClick={handleBack}
              >
                Voltar
              </Button>

              <Box style={{ display: 'flex', flexGrow: 1 }} />

              {activeStep === steps.length - 1 ? (
                <Button
                  style={{ background: '#85287e', width: 160 }}
                  variant="contained"
                  onClick={submitAnalise}
                >
                  {getStepButtonText()} <NavigateNext />
                </Button>
              ) : (
                <Button
                  style={{ background: '#85287e', width: 160 }}
                  variant="contained"
                  onClick={handleNext}
                >
                  {getStepButtonText()} <NavigateNext />
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </Container>
  );
}