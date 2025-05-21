import { useState } from 'react';
import { Card, Container, Box, Typography, Stepper, Step, StepLabel, Divider, Button } from '@mui/material';
import NavigateNext from '@mui/icons-material/NavigateNext';
// import InformacoesSolicitante from './stepsForm1/InformacoesSolicitante';
// import InformacoesMedicamento from './stepsForm1/InformacoesMedicamento';
// import InformacoesTecnologiaSaude from './stepsForm1/InformacoesTecnologiaSaude';
// import JustificativaAnalise from './stepsForm1/JustificativaAnalise';
// import RevisaoSolicitacao from './stepsForm1/RevisaoSolicitacao';

const FormularioAnaliseLaboratorial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Informações do Solicitante
    solicitante: {
      nome: '',
      dataNascimento: '',
      genero: '',
      numeroRegistro: '',
      endereco: '',
      telefone: '',
      email: '',
    },

    // Informações do Medicamento
    medicamento: {
      nome: '',
      dosagem: '',
      formaFarmaceutica: '',
      fabricante: '',
      enderecoFabricante: '',
      lote: '',
      dataFabrico: '',
      dataValidade: '',
      tipoAnalise: [],
      outroTipoAnalise: '',
    },

    // Informações da Tecnologia de Saúde
    tecnologiaSaude: {
      nome: '',
      fabricante: '',
      enderecoFabricante: '',
      lote: '',
      dataFabrico: '',
      dataValidade: '',
      tipoAnalise: [], // Por padrão será 'Validação'
    },

    // Justificativa
    justificativa: '',
    
    // Tipo de Produto a Analisar
    tipoProduto: 'medicamento', // 'medicamento' ou 'tecnologiaSaude'
    
    // Data da solicitação
    dataSolicitacao: new Date().toISOString().split('T')[0],
  });

  const steps = [
    'Informações do Solicitante',
    'Detalhes do Produto',
    'Tipo de Análise e Justificativa',
    'Revisão da Solicitação',
  ];

  // const handleUpdateFormData = (section, data) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [section]: { ...prevData[section], ...data },
  //   }));
  // };

  // const handleUpdateTipoProduto = (tipo) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     tipoProduto: tipo,
  //   }));
  // };

  // const handleUpdateJustificativa = (justificativa) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     justificativa,
  //   }));
  // };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // Aqui você implementará a integração com a API posteriormente
    console.log('Dados do formulário prontos para envio:', formData);
    
    // Simulando sucesso de envio
    alert('Solicitação enviada com sucesso!');
    
    // Opcionalmente, redirecionar ou limpar o formulário
    setActiveStep(0);
    // Reset form data if needed
    // setFormData({...});
  };

  // Renderiza o passo atual do formulário
  // const getStepContent = (step) => {
  //   switch (step) {
  //     case 0:
  //       return (
  //         <InformacoesSolicitante 
  //           solicitanteData={formData.solicitante} 
  //           onUpdateData={(data) => handleUpdateFormData('solicitante', data)} 
  //         />
  //       );
  //     case 1:
  //       return formData.tipoProduto === 'medicamento' ? (
  //         <InformacoesMedicamento 
  //           medicamentoData={formData.medicamento}
  //           onUpdateData={(data) => handleUpdateFormData('medicamento', data)}
  //           onChangeTipoProduto={handleUpdateTipoProduto}
  //         />
  //       ) : (
  //         <InformacoesTecnologiaSaude 
  //           tecnologiaData={formData.tecnologiaSaude}
  //           onUpdateData={(data) => handleUpdateFormData('tecnologiaSaude', data)}
  //           onChangeTipoProduto={handleUpdateTipoProduto}
  //         />
  //       );
  //     case 2:
  //       return (
  //         <JustificativaAnalise 
  //           justificativa={formData.justificativa}
  //           onUpdateJustificativa={handleUpdateJustificativa}
  //           tipoProduto={formData.tipoProduto}
  //           tipoAnalise={
  //             formData.tipoProduto === 'medicamento'
  //               ? formData.medicamento.tipoAnalise
  //               : formData.tecnologiaSaude.tipoAnalise
  //           }
  //           onUpdateTipoAnalise={(tipoAnalise) => 
  //             handleUpdateFormData(
  //               formData.tipoProduto === 'medicamento' ? 'medicamento' : 'tecnologiaSaude', 
  //               { tipoAnalise }
  //             )
  //           }
  //           outroTipoAnalise={formData.medicamento.outroTipoAnalise}
  //           onUpdateOutroTipoAnalise={(outroTipoAnalise) => 
  //             handleUpdateFormData('medicamento', { outroTipoAnalise })
  //           }
  //         />
  //       );
  //     case 3:
  //       return (
  //         <RevisaoSolicitacao 
  //           formData={formData} 
  //         />
  //       );
  //     default:
  //       return 'Passo desconhecido';
  //   }
  // };

  return (
    <Card style={{ marginBottom: 12 }}>
      <Container>
        <Box my={4}>
          <Typography variant="h4" align="center" style={{ marginBottom: 24 }}>
            Formulário de Solicitação de Análise Laboratorial de
            Medicamentos e Tecnologias de Saúde
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider style={{ marginTop: 20, marginBottom: 20 }} />

          {/* <Box my={4}>{getStepContent(activeStep)}</Box> */}

          <Box display="flex" justifyContent="space-between" mt={4} mb={2}>
            <Button
              variant="outlined"
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Voltar
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ background: '#85287e' }}
              >
                Enviar Solicitação
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                style={{ background: '#85287e' }}
              >
                Próximo <NavigateNext />
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Card>
  );
};

export default FormularioAnaliseLaboratorial;