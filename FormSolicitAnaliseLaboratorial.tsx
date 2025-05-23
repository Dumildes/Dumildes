import { useState } from 'react';
import { Card, Container, Box, Typography, Stepper, Step, StepLabel, Divider, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
import InformacoesSolicitante from './stepsFormulariosSolicit/stepDadosRequerente';
import InformacoesMedicamento from './stepsFormulariosSolicit/stepInformacoesMedicamento';
import InformacoesJustificativa from './stepsFormulariosSolicit/stepJustificativa';
import { useDispatch } from 'react-redux';

export default function FormularioAnaliseLaboratorial() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(-2); // -2 para seleção de direção, -1 para tipo de solicitante
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [tipoSolicitante, setTipoSolicitante] = useState('');
  const [direcao, setDirecao] = useState('');

  const steps = [
    'Informações do Solicitante',
    'Informações do Produto',
    'Justificativa para a Análise',
  ];

  function getStepContent(stepIndex: number) {
    switch (stepIndex) { 
      case 0:
        return <InformacoesSolicitante tipoSolicitante={tipoSolicitante} />;
      case 1:
        return <InformacoesMedicamento />;
      case 2:
        return <InformacoesJustificativa />;
      default:
        return null;
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      setActiveStep(-1); // Volta para a seleção de tipo de solicitante
      setTipoSolicitante('');
    } else if (activeStep === -1) {
      setActiveStep(-2); // Volta para a seleção de direção
      setDirecao('');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleDirecaoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirecao(event.target.value);
  };

  const handleTipoSolicitanteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoSolicitante(event.target.value);
  };

  const continuarParaTipoSolicitante = () => {
    if (direcao) {
      setActiveStep(-1);
    }
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
      setOpen(false);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Erro ao processar solicitação');
      setOpen(false);
    }
  };

  const renderSelecaoDirecao = () => (
    <Box>
      <Typography variant="h6" align="center" style={{ marginBottom: 40 }}>
        SELECIONAR DIRECÇÃO
      </Typography>
      <Box style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <Paper 
          style={{ 
            padding: 20, 
            width: 200, 
            cursor: 'pointer',
            border: direcao === 'OFA' ? '2px solid #85287e' : '1px solid #e0e0e0'
          }}
          onClick={() => setDirecao('OFA')}
        >
          <Typography variant="h5" align="center" style={{ color: '#85287e' }}>
            OFA
          </Typography>
        </Paper>
        <Paper 
          style={{ 
            padding: 20, 
            width: 200, 
            cursor: 'pointer',
            border: direcao === 'CAPFA' ? '2px solid #85287e' : '1px solid #e0e0e0'
          }}
          onClick={() => setDirecao('CAPFA')}
        >
          <Typography variant="h5" align="center" style={{ color: '#85287e' }}>
            CAPFA
          </Typography>
        </Paper>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <Button
          style={{ background: '#85287e', width: 120 }}
          variant="contained"
          onClick={continuarParaTipoSolicitante}
          disabled={!direcao}
        >
          Continuar <NavigateNext />
        </Button>
      </Box>
    </Box>
  );

  const renderSelecaoTipoSolicitante = () => (
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
  );

  return (
    <Container style={{ marginBottom: 12, minHeight: "70vh" }}>
      <Typography variant="h4" style={{ marginBottom: 20, color: '#85287e' }}>
        SOLICITAÇÃO DE ANÁLISE LABORATORIAL
      </Typography>
      <Card style={{ marginBottom: 12, padding: 22 }}>
        {activeStep === -2 ? (
          renderSelecaoDirecao()
        ) : activeStep === -1 ? (
          renderSelecaoTipoSolicitante()
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
          </>
        )}
      </Card>
    </Container>
  );
}