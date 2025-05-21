import { useState } from 'react';
import { Card, Container, Box, Typography, Stepper, Step, StepLabel, Divider, Button } from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
import InformacoesSolicitante from './stepsFormularios/stepDadosRequerente';
import InformacoesMedicamento from './stepsFormularios/stepInformacoesMedicamento';
import InformacoesTecnologiaSaude from './stepsFormularios/stepTecnologiaSaude';
import JustificativaConfirmacao from './stepsFormularios/stepJustificativaConfirmacao';
import { useDispatch } from 'react-redux';
import MessageError from '../../../messages/messageError';
import LoadingBackdrop from '../../../load/loadingBackdrop';

export default function FormularioAnaliseLaboratorial() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [open, setOpen] = useState(false);

  const steps = [
    'Dados do Requerente',
    'Informações do Medicamento',
    'Informações da Tecnologia de Saúde',
    'Justificativa e Confirmação'
  ];

  function getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return <InformacoesSolicitante />;
      case 1:
        return <InformacoesMedicamento />;
      case 2:
        return <InformacoesTecnologiaSaude />;
      case 3:
        return <JustificativaConfirmacao />;
      default:
        return <InformacoesSolicitante />;
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const submitAnalise = async () => {
    setOpen(true);
    try {
      // Implementar lógica de submissão
      setOpen(false);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Erro ao processar solicitação');
      setOpen(false);
    }
  };

  return (
    <Card style={{ marginBottom: 12 }}>
      <LoadingBackdrop open={open} />
      {errorMessage && <MessageError message={errorMessage} />}

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

      <Container>
        <Box>{getStepContent(activeStep)}</Box>

        <div style={{ display: 'flex', margin: '20px 10px' }}>
          <Button
            style={{ background: '#ebebf4' }}
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Voltar
          </Button>

          <Box style={{ display: 'flex', flexGrow: 1 }} />

          {activeStep === steps.length - 1 ? (
            <Button 
              style={{ background: '#85287e', width: 120 }} 
              variant="contained" 
              onClick={submitAnalise}
            >
              Enviar <NavigateNext />
            </Button>
          ) : (
            <Button
              style={{ background: '#85287e', width: 120 }}
              variant="contained"
              onClick={handleNext}
            >
              Próximo <NavigateNext />
            </Button>
          )}
        </div>
      </Container>
    </Card>
  );
}