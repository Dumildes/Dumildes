import { useState, useEffect, ChangeEvent } from 'react';
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
import api from '../../../../services/api';
// import MessageError from '../../../messages/messageError';
// import LoadingBackdrop from '../../../load/loadingBackdrop';

interface FormData {
  _id: string;
  // Dados da Unidade de Saúde e do Paciente
  unidadeSaude: string;
  provincia: string;
  distrito: string;
  bairro: string;
  rua: string;
  email: string;
  nomeCompleto: string;
  dataNascimento: string;
  idade: string;
  sexo: string;
  peso: string;
  altura: string;
  
  // Informações sobre o Medicamento
  nomeMedicamento: string;
  nomeComercial: string;
  numeroLote: string;
  dataFabrico: string;
  dataExpiracao: string;
  nomeFabricante: string;
  paisOrigem: string;
  fornecedor: string;
  dataInicioTratamento: string;
  dataFimTratamento: string;
  dose: string;
  viaAdministracao: string;
  indicacaoTerapeutica: string;
  
  // Descrição dos Efeitos Indesejáveis
  descricaoEfeitos: string;
  dataInicioEfeitos: string;
  gravidade: string;
  evolucao: string;
  
  // Evolução e Tratamento
  medidaAdotada: string;
  tratamentoEfeitos: string;
  observacoes: string;
  
  // Notificador
  nomeNotificador: string;
  catProfissionalNotificador: string;
  telFaxNotificador: string;
  emailNotificador: string;
}

interface Estabelecimento {
  empresa: {
    nome: string;
    provincia: string;
    municipio: string;
    bairro: string;
    rua: string;
    email: string;
  }
}

export default function FichaNotificacaoProdutos() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento>();
  const [searchTerm, setSearchTerm] = useState('');
  const [messageError, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const steps = [
    'Dados da Unidade de Saúde e do Paciente',
    'Informações sobre o Medicamento',
    'Descrição dos Efeitos Indesejáveis',
    'Evolução e Tratamento',
    'Notificador'
  ];

  const [formData, setFormData] = useState<FormData>({
    _id: '',
    // Dados da Unidade de Saúde e do Paciente
    unidadeSaude: '',
    provincia: '',
    distrito: '',
    bairro: '',
    rua: '',
    email: '',
    nomeCompleto: '',
    dataNascimento: '',
    idade: '',
    sexo: '',
    peso: '',
    altura: '',
    
    // Informações sobre o Medicamento
    nomeMedicamento: '',
    nomeComercial: '',
    numeroLote: '',
    dataFabrico: '',
    dataExpiracao: '',
    nomeFabricante: '',
    paisOrigem: '',
    fornecedor: '',
    dataInicioTratamento: '',
    dataFimTratamento: '',
    dose: '',
    viaAdministracao: '',
    indicacaoTerapeutica: '',
    
    // Descrição dos Efeitos Indesejáveis
    descricaoEfeitos: '',
    dataInicioEfeitos: '',
    gravidade: '',
    evolucao: '',
    
    // Evolução e Tratamento
    medidaAdotada: '',
    tratamentoEfeitos: '',
    observacoes: '',
    
    // Notificador
    nomeNotificador: '',
    catProfissionalNotificador: '',
    telFaxNotificador: '',
    emailNotificador: '',
  });

  // Estados adicionais para checkboxes e seleções específicas (adaptar conforme necessário)
  const [efeitosState, setEfeitosState] = useState({
    efeitoA: false,
    efeitoB: false,
    efeitoC: false,
    efeitoD: false,
    efeitoE: false,
    efeitosOutros: ''
  });

  const [respostas, setRespostas] = useState({
    medicamentoSuspeito: '',
    relacaoCausal: '',
    reintroducao: '',
    medicamentosConcomitantes: '',
    historicoAlergias: ''
  });

  const handleResposta = (key: string, valor: string) => {
    setRespostas(prev => ({ ...prev, [key]: valor }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setEfeitosState(prev => ({ ...prev, [name]: checked }));
  };

  const handleOutrosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEfeitosState(prev => ({
      ...prev, [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'dadosNotificacao',
      payload: { dadosNotificacao: formData }
    });
  }, [formData, dispatch]);

  const buscarEstabelecimento = () => {
    if (!searchTerm) return;
    setLoading(true);
    api.post('/estabelecimento/search', { search: searchTerm })
      .then((res) => {
        console.log(res.data);
        res.data.estabelecimentos.length === 0 ?
          setMessageError("Estabelecimento não registrado, preencha os campos abaixo:")
          : setFormData(prev => ({
            ...prev,
            _id: res.data.estabelecimentos?.[0]?._id ?? '',
            unidadeSaude: res.data.estabelecimentos?.[0]?.empresa?.nome ?? '',
            provincia: res.data.estabelecimentos?.[0]?.empresa?.provincia ?? '',
            distrito: res.data.estabelecimentos?.[0]?.empresa?.municipio ?? '',
            bairro: res.data.estabelecimentos?.[0]?.empresa?.bairro ?? '',
            rua: res.data.estabelecimentos?.[0]?.empresa?.rua ?? '',
            email: res.data.estabelecimentos?.[0]?.empresa?.email ?? '',
          }));
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
        setMessageError(err.response?.data?.message || 'Erro ao buscar estabelecimento');
      })
      .finally(() => setLoading(false));
  };

  function getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return <DadosUnidadeSaude 
          formData={formData} 
          handleChange={handleChange} 
          buscarEstabelecimento={buscarEstabelecimento} 
          searchTerm={searchTerm} 
          loading={loading} 
          setSearchTerm={setSearchTerm} 
          messageError={messageError} 
          show={show} 
        />;
      case 1:
        return <InformacaoMedicamento 
          formData={formData} 
          handleChange={handleChange} 
        />;
      case 2:
        return <DescricaoEfeitosIndesejados 
          formData={formData}
          handleChange={handleChange}
          efeitosState={efeitosState}
          handleCheckboxChange={handleCheckboxChange}
          handleOutrosChange={handleOutrosChange}
        />;
      case 3:
        return <EvolucaoTratamento 
          formData={formData}
          handleChange={handleChange}
          respostas={respostas} 
          handleResposta={handleResposta} 
        />;
      case 4:
        return <Notificador 
          formData={formData} 
          handleChange={handleChange} 
        />;
      default:
        return <DadosUnidadeSaude 
          formData={formData} 
          handleChange={handleChange} 
          buscarEstabelecimento={buscarEstabelecimento} 
          searchTerm={searchTerm} 
          loading={loading} 
          setSearchTerm={setSearchTerm} 
          messageError={messageError} 
          show={show} 
        />;
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
      // Aqui você implementará a chamada da API com os dados específicos
      // que você mencionou que enviará depois
      const response = await api.post('/notificacao-produtos/create', {
        // Dados do estabelecimento
        'estabelecimentoId': formData._id,
        'unidadeSaudeNome': formData.unidadeSaude,
        'unidadeSaudeProvincia': formData.provincia,
        'unidadeSaudeDistrito': formData.distrito,
        'unidadeSaudeBairro': formData.bairro,
        'unidadeSaudeRua': formData.rua,
        'unidadeSaudeEmail': formData.email,

        // Dados do paciente
        'pacienteNome': formData.nomeCompleto,
        'pacienteDataNascimento': formData.dataNascimento,
        'pacienteIdade': formData.idade,
        'pacienteSexo': formData.sexo,
        'pacientePeso': formData.peso,
        'pacienteAltura': formData.altura,

        // Dados do medicamento
        'medicamentoNome': formData.nomeMedicamento,
        'medicamentoNomeComercial': formData.nomeComercial,
        'medicamentoNumeroLote': formData.numeroLote,
        'medicamentoDataFabrico': formData.dataFabrico,
        'medicamentoDataExpiracao': formData.dataExpiracao,
        'medicamentoNomeFabricante': formData.nomeFabricante,
        'medicamentoPaisOrigem': formData.paisOrigem,
        'medicamentoFornecedor': formData.fornecedor,
        'medicamentoDataInicioTratamento': formData.dataInicioTratamento,
        'medicamentoDataFimTratamento': formData.dataFimTratamento,
        'medicamentoDose': formData.dose,
        'medicamentoViaAdministracao': formData.viaAdministracao,
        'medicamentoIndicacaoTerapeutica': formData.indicacaoTerapeutica,

        // Efeitos indesejáveis
        'efeitosDescricao': formData.descricaoEfeitos,
        'efeitosDataInicio': formData.dataInicioEfeitos,
        'efeitosGravidade': formData.gravidade,
        'efeitosEvolucao': formData.evolucao,

        // Efeitos específicos (checkboxes)
        'efeitoA': efeitosState.efeitoA,
        'efeitoB': efeitosState.efeitoB,
        'efeitoC': efeitosState.efeitoC,
        'efeitoD': efeitosState.efeitoD,
        'efeitoE': efeitosState.efeitoE,
        'efeitosOutros': efeitosState.efeitosOutros,

        // Evolução e tratamento
        'medidaAdotada': formData.medidaAdotada,
        'tratamentoEfeitos': formData.tratamentoEfeitos,
        'observacoes': formData.observacoes,

        // Respostas específicas
        'medicamentoSuspeito': respostas.medicamentoSuspeito,
        'relacaoCausal': respostas.relacaoCausal,
        'reintroducao': respostas.reintroducao,
        'medicamentosConcomitantes': respostas.medicamentosConcomitantes,
        'historicoAlergias': respostas.historicoAlergias,

        // Notificador
        'notificadorNome': formData.nomeNotificador,
        'notificadorCategoriaProfissional': formData.catProfissionalNotificador,
        'notificadorTel': formData.telFaxNotificador,
        'notificadorEmail': formData.emailNotificador,
      });

      console.log(response.data);
      setOpen(false);
      // Aqui você pode adicionar lógica para redirecionar ou mostrar mensagem de sucesso
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error?.response?.data?.message || error?.message || 'Erro ao processar solicitação');
      setOpen(false);
    }
  };

  // Validações por step
  const stepValidations: { [key: number]: () => boolean } = {
    0: () =>
      formData.unidadeSaude.trim() !== '' &&
      formData.provincia.trim() !== '' &&
      formData.distrito.trim() !== '' &&
      formData.rua.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.nomeCompleto.trim() !== '' &&
      formData.dataNascimento.trim() !== '' &&
      formData.sexo.trim() !== '',
    1: () =>
      formData.nomeMedicamento.trim() !== '' &&
      formData.nomeComercial.trim() !== '' &&
      formData.numeroLote.trim() !== '' &&
      formData.dataFabrico.trim() !== '' &&
      formData.dataExpiracao.trim() !== '' &&
      formData.nomeFabricante.trim() !== '' &&
      formData.dataInicioTratamento.trim() !== '' &&
      formData.dose.trim() !== '' &&
      formData.viaAdministracao.trim() !== '',
    2: () =>
      formData.descricaoEfeitos.trim() !== '' &&
      formData.dataInicioEfeitos.trim() !== '' &&
      formData.gravidade.trim() !== '',
    3: () =>
      formData.medidaAdotada.trim() !== '' &&
      respostas.medicamentoSuspeito.trim() !== '' &&
      respostas.relacaoCausal.trim() !== '',
    4: () =>
      formData.nomeNotificador.trim() !== '' &&
      formData.catProfissionalNotificador.trim() !== '' &&
      formData.telFaxNotificador.trim() !== '' &&
      formData.emailNotificador.trim() !== '',
  };

  const isStepValid = (step: number): boolean => {
    return stepValidations[step]?.() ?? true;
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
              disabled={!isStepValid(activeStep)}
            >
              Enviar
            </Button>
          ) : (
            <Button
              style={{ background: '#85287e', width: 120 }}
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
            >
              Próximo <NavigateNext />
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
}