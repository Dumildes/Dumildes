import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Container,
  Typography,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { ArrowBack, Send, NavigateNext, Clear } from '@mui/icons-material';

import SuccessMessage from './components/SuccessMessage';
import { SelectChangeEvent } from '@mui/material/Select';
import api from '../../../../services/api';
import { Step1DadosRemetente } from './components/Step1DadosRemetente';
import Step2DadosResponsavel from './components/Step2DadosResponsavel';
import Step3Produtos from './components/Step3Produtos';
import Step4Anexos from './components/Step4Anexos';
import Step5Resumo from './components/Step5Resumo';
import type { FormData, FormErrors, Produto } from './components/types';
import HeaderSession from '../../../../utils/headerSession';
import RegisterAccess from '../../../../utils/registerAccess';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const steps = ['Dados do Remetente', 'Dados do Responsável', 'Produtos', 'Anexos', 'Resumo'];

const theme = createTheme({
  palette: {
    primary: {
      main: '#85287E'
    }
  }
});

const AnaliseLaboratorial: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    tipoRemetente: '',
    nome: '',
    nifBi: '',
    email: '',
    tel: '',
    provincia: '',
    municipio: '',
    bairro: '',
    justificativa: '',
    remetidoPorNome: '',
    remetidoPorTel: '',
    remetidoPorEmail: '',
    remetidoPorBi: '',
    remetidoPorDataNascimento: '',
    remetidoPorGenero: ''
  });

  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: '1',
      tipo: '',
      tipoAnalise: [], // Changed from '' to []
      nome: '',
      fabricante: '',
      lote: '',
      paisFabricante: '',
      enderecoFabricante: '',
      dataFabrico: '',
      dataValidade: '',
      dosagemConcentracao: '',
      formaFarmaceutica: ''
    }
  ]);

  const [anexos, setAnexos] = useState<{
    autorizacaoImportacao: File | null;
    certificadoImportacao: File | null;
    remetidoPorAnexoBi: File | null;
  }>({
    autorizacaoImportacao: null,
    certificadoImportacao: null,
    remetidoPorAnexoBi: null
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^\d{9}$/;
    return re.test(phone);
  };

  const validateNIF = (nif: string): boolean => {
    const re = /^(?:\d{9}|[A-Za-z0-9]{9})$/;
    return re.test(nif);
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (activeStep) {
      case 0:
        // Validar dados do remetente
        if (!formData.tipoRemetente) {
          newErrors.tipoRemetente = 'Tipo de remetente é obrigatório';
        }

        if (!formData.nome || formData.nome.length < 3) {
          newErrors.nome = 'Nome completo é obrigatório (mínimo 3 caracteres)';
        }

        if (!formData.nifBi || !validateNIF(formData.nifBi)) {
          newErrors.nifBi = 'NIF/BI inválido (deve ter 9 dígitos)';
        }

        if (!formData.email || !validateEmail(formData.email)) {
          newErrors.email = 'Email inválido';
        }

        if (!formData.tel || !validatePhone(formData.tel)) {
          newErrors.tel = 'Telefone inválido (deve começar com 9 e ter 9 dígitos)';
        }

        if (!formData.provincia) {
          newErrors.provincia = 'Selecione uma província';
        }

        if (!formData.municipio || formData.municipio.length < 2) {
          newErrors.municipio = 'Município é obrigatório (mínimo 2 caracteres)';
        }

        if (!formData.bairro || formData.bairro.length < 2) {
          newErrors.bairro = 'Bairro é obrigatório (mínimo 2 caracteres)';
        }

        if (!formData.justificativa || formData.justificativa.length < 10) {
          newErrors.justificativa = 'Justificativa é obrigatória (mínimo 10 caracteres)';
        }
        break;

      case 1:
        // Validar dados do responsável
        if (!formData.remetidoPorNome) newErrors.remetidoPorNome = 'Nome do remetente é obrigatório';
        if (!formData.remetidoPorTel) newErrors.remetidoPorTel = 'Telefone do remetente é obrigatório';
        if (!formData.remetidoPorEmail) newErrors.remetidoPorEmail = 'Email do remetente é obrigatório';
        if (!formData.remetidoPorBi) newErrors.remetidoPorBi = 'BI do remetente é obrigatório';
        if (!formData.remetidoPorDataNascimento) newErrors.remetidoPorDataNascimento = 'Data de nascimento é obrigatória';
        if (!formData.remetidoPorGenero) newErrors.remetidoPorGenero = 'Gênero é obrigatório';
        break;

      case 2:
        // Validar produtos
        produtos.forEach((produto, index) => {
          if (!produto.tipo) newErrors[`produto_${index}_tipo`] = 'Tipo de produto é obrigatório';
          if (!produto.tipoAnalise || produto.tipoAnalise.length === 0) newErrors[`produto_${index}_tipoAnalise`] = 'Tipo de análise é obrigatório (selecione ao menos um)';
          if (!produto.nome) newErrors[`produto_${index}_nome`] = 'Nome do produto é obrigatório';
          if (!produto.fabricante) newErrors[`produto_${index}_fabricante`] = 'Fabricante é obrigatório';
          if (!produto.lote) newErrors[`produto_${index}_lote`] = 'Lote é obrigatório';
          if (!produto.paisFabricante) newErrors[`produto_${index}_paisFabricante`] = 'País do fabricante é obrigatório';
          if (!produto.enderecoFabricante) newErrors[`produto_${index}_enderecoFabricante`] = 'Endereço do fabricante é obrigatório';
          if (!produto.dataFabrico) newErrors[`produto_${index}_dataFabrico`] = 'Data de fabrico é obrigatória';
          if (!produto.dataValidade) newErrors[`produto_${index}_dataValidade`] = 'Data de validade é obrigatória';
          if (!produto.dosagemConcentracao) newErrors[`produto_${index}_dosagemConcentracao`] = 'Dosagem/Concentração é obrigatória';
          if (!produto.formaFarmaceutica) newErrors[`produto_${index}_formaFarmaceutica`] = 'Forma farmacêutica é obrigatória';
        });
        break;

      case 3:
        // Validar anexos
        if (!anexos.remetidoPorAnexoBi) {
          newErrors.remetidoPorAnexoBi = 'BI do Responsável é obrigatório';
        }

        if (formData.tipoRemetente === 'Importador') {
          if (!anexos.autorizacaoImportacao) {
            newErrors.autorizacaoImportacao = 'Autorização de Importação é obrigatória';
          }
          if (!anexos.certificadoImportacao) {
            newErrors.certificadoImportacao = 'Certificado de Importação é obrigatório';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!name) {
      console.error('Nome do campo não definido:', e.target);
      return;
    }

    // console.log('handleChange:', name, value);

    // Validar campos específicos
    let newValue = value;
    let newErrors = { ...errors };

    if (name === 'tel') {
      newValue = value.replace(/\D/g, '').slice(0, 9);
      if (newValue && !validatePhone(newValue)) {
        newErrors.tel = 'Telefone inválido (deve ter 9 dígitos)';
      } else {
        delete newErrors.tel;
      }
    } else if (name === 'nifBi') {
      newValue = value.replace(/[^A-Za-z0-9]/g, '').slice(0, 9);
      if (newValue && !validateNIF(newValue)) {
        newErrors.nifBi = 'NIF/BI inválido (deve ter 9 caracteres)';
      } else {
        delete newErrors.nifBi;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    setErrors(newErrors);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name as string]: value
    }));

    if (errors[name as string]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };

  const handleProdutoChange = (index: number, field: keyof Produto, value: string | File | string[]) => {
    const newProdutos = [...produtos];
    newProdutos[index] = {
      ...newProdutos[index],
      [field]: value
    };

    setProdutos(newProdutos);

    // Limpar erro se existir
    if (errors[`produto_${index}_${field}`]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [`produto_${index}_${field}`]: ''
      }));
    }
  };

  const adicionarProduto = () => {
    const novoProduto: Produto = {
      id: Date.now().toString(),
      tipo: '',
      tipoAnalise: [],
      nome: '',
      fabricante: '',
      lote: '',
      paisFabricante: '',
      enderecoFabricante: '',
      dataFabrico: '',
      dataValidade: '',
      dosagemConcentracao: '',
      formaFarmaceutica: ''
    };
    setProdutos(prev => [...prev, novoProduto]);
  };

  const removerProduto = (index: number) => {
    if (produtos.length > 1) {
      setProdutos(prev => prev.filter((_, i) => i !== index));

      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`produto_${index}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setAnexos(prev => ({
      ...prev,
      [name]: file
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      tipoRemetente: '',
      nome: '',
      nifBi: '',
      email: '',
      tel: '',
      provincia: '',
      municipio: '',
      bairro: '',
      justificativa: '',
      remetidoPorNome: '',
      remetidoPorTel: '',
      remetidoPorEmail: '',
      remetidoPorBi: '',
      remetidoPorDataNascimento: '',
      remetidoPorGenero: ''
    });

    setProdutos([{
      id: '1',
      tipo: '',
      tipoAnalise: [],
      nome: '',
      fabricante: '',
      lote: '',
      paisFabricante: '',
      enderecoFabricante: '',
      dataFabrico: '',
      dataValidade: '',
      dosagemConcentracao: '',
      formaFarmaceutica: ''
    }]);

    setAnexos({
      autorizacaoImportacao: null,
      certificadoImportacao: null,
      remetidoPorAnexoBi: null
    });
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
    setActiveStep(0);

    const fileInput = document.getElementById('anexo-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const enviarProdutos = async (solicitacaoAnaliseId: string): Promise<void> => {
    const produtosComErro: string[] = [];

    // Enviar cada produto individualmente
    for (const produto of produtos) {
      try {
        const produtoData = new FormData();

        // Adicionar campos do produto
        Object.entries(produto).forEach(([key, value]) => {
          if (value instanceof File) {
            // Se for um arquivo (receitaMedica), enviar como File
            produtoData.append(key, value);
          } else {
            produtoData.append(key, String(value));
          }
        });

        // Adicionar o ID da solicitação
        produtoData.append('solicitacaoAnaliseId', solicitacaoAnaliseId);

        const response = await api.patch(`/solicitacao-analise/producto/add`, produtoData);

        console.log("Dadaos Solicite:", response)

        if (response.status !== 200 && response.status !== 201) {
          produtosComErro.push(produto.nome);
        }
      } catch (error) {
        console.error(`Erro ao enviar produto ${produto.nome}:`, error);
        produtosComErro.push(produto.nome);
      }
    }

    if (produtosComErro.length > 0) {
      throw new Error(`Erro ao enviar ${produtosComErro.length} produto(s): ${produtosComErro.join(', ')}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });

      if (anexos.remetidoPorAnexoBi) {
        formDataToSend.append('remetidoPorAnexoBi', anexos.remetidoPorAnexoBi);
      }

      if (formData.tipoRemetente === 'Importador') {
        if (anexos.autorizacaoImportacao) {
          formDataToSend.append('autorizacaoImportacao', anexos.autorizacaoImportacao);
        }
        if (anexos.certificadoImportacao) {
          formDataToSend.append('certificadoImportacao', anexos.certificadoImportacao);
        }
      }

      const formDataEntries: Record<string, any> = {};
      formDataToSend.forEach((value, key) => {
        formDataEntries[key] = value;
      });

      try {
        const response = await api.post('/solicitacao-analise/create', formDataToSend);

        console.log("Dados Produto:", response)

        if (response.data?.solicitacaoAnalise?._id) {
          await enviarProdutos(response.data.solicitacaoAnalise._id);

          setSuccessMessage('Solicitação enviada com sucesso!');
          setOpenSuccessSnackbar(true);
          setShowSuccessCard(true);

          // Limpar formulário
          resetForm();
        } else {
          console.error('Resposta sem ID:', response.data);
          throw new Error(`Erro ao criar solicitação: resposta sem ID - ${JSON.stringify(response.data)}`);
        }
      } catch (err: any) {
        console.error('Erro na requisição:', err.response?.data || err);
        throw err;
      }
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
      console.error('Detalhes do erro:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      let errorMsg = 'Erro ao enviar solicitação';

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data) {
        errorMsg = `Erro do servidor: ${JSON.stringify(error.response.data)}`;
      } else if (error.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      setOpenErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return (
          <Step1DadosRemetente
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
        );
      case 1:
        return (
          <Step2DadosResponsavel
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
        );
      case 2:
        return (
          <Step3Produtos
            produtos={produtos}
            errors={errors}
            handleProdutoChange={handleProdutoChange}
            adicionarProduto={adicionarProduto}
            removerProduto={removerProduto}
          />
        );
      case 3:
        return (
          <Step4Anexos
            formData={formData}
            anexos={anexos}
            errors={errors}
            handleFileChange={handleFileChange}
            isUploading={loading}
          />
        );
      case 4:
        return (
          <Step5Resumo
            formData={formData}
            produtos={produtos}
            anexos={anexos}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ maxWidth: 1200, minHeight: '70vh', p: 3}}>
        <RegisterAccess page={'análise laboratorial'} />
        <HeaderSession title='SOLICITAÇÃO DE ANÁLISE LABORATORIAL' />
        {showSuccessCard ? (
          <SuccessMessage />
        ) : (
          <Card variant="outlined" sx={{px: 2}}>
            <CardContent>
              <Box sx={{ width: '100%', mb: 4, pb: 1, borderBottom: "1px inset #bfbfbf" }}>
                <Stepper sx={{ py: 4, }} activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    color="primary"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                    sx={{ mr: 1 }}
                  >
                    Voltar
                  </Button>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={resetForm}
                      disabled={loading}
                      startIcon={<Clear />}
                    >
                      Limpar
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button
                        onClick={(e) => {e.preventDefault();handleSubmit(e as any);}}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                      >
                        {loading ? 'Enviando...' : 'Enviar Solicitação'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        endIcon={<NavigateNext />}
                        
                      >
                        Seguinte
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default AnaliseLaboratorial;
