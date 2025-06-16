import { useState } from 'react';
import { Card, Container, Box, Typography, Stepper, Step, StepLabel, Divider, Button } from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
import InformacaoMedicamento from './stepsFichaNotificacaoProdutos/stepInformacaoMedicamento';
import Notificador from './stepsFichaNotificacaoProdutos/stepNotificador';
import EvolucaoTratamento from './stepsFichaNotificacaoProdutos/stepEvolucaoTratamento';
import DescricaoEfeitosIndesejados from './stepsFichaNotificacaoProdutos/stepDescricaoEfeitosIndesejados';
import DadosUnidadeSaude from './stepsFichaNotificacaoProdutos/stepDadosUnidadeSaude';
import { useDispatch } from 'react-redux';
import HeaderSession from '../../../../utils/headerSession';
import RegisterAccess from '../../../../utils/registerAccess';
// import MessageError from '../../../messages/messageError';
// import LoadingBackdrop from '../../../load/loadingBackdrop';

export default function FichaNotificacaoProdutos() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [open, setOpen] = useState(false);

  const steps = [
    'Dados da Unidade de Saúde e do Paciente',
    'Informações sobre o Medicamento',
    'Descrição dos Efeitos Indesejáveis',
    'Evolução e Tratamento',
    'Notificador'
  ];

  function getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return <DadosUnidadeSaude />;
      case 1:
        return <InformacaoMedicamento />;
      case 2:
        return <DescricaoEfeitosIndesejados />;
      case 3:
        return <EvolucaoTratamento />;
      case 4:
        return <Notificador />;
      default:
        return <DadosUnidadeSaude />;
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const submitRecolha = async () => {
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
    <Container style={{ marginBottom: 12, minHeight: "70vh" }}>
      <RegisterAccess page={'ficha de notificacoes de suspeita de reacções adversas a medicamentos'} />
      <HeaderSession title='FICHA DE NOTIFICAÇÃO DE SUSPEITA DE REACÇÕES ADVERSAS A MEDICAMENTOS E PRODUTOS SANITÁRIOS' />
      <Card style={{ marginBottom: 12, padding: 22 }}>

        {/* <LoadingBackdrop open={open} />
        {errorMessage && <MessageError message={errorMessage} />} */}

        <div style={{ overflow: 'auto' }}>
          <Stepper color="secondary" activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label} >
                <StepLabel style={{ color: '#85287e' }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider />
        </div>

        <Box sx={{ marginTop: 6 }}>{getStepContent(activeStep)}</Box>

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
              onClick={submitRecolha}
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
      </Card>
    </Container>
  );
}