
import { useState, useEffect } from "react"
import { Card, Divider, makeStyles } from "@material-ui/core";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@mui/material/Button';
import FormDadosEmpresa from './stepsFormularios/stepCadastroEmpresa';
import FormRepresentante from "./stepsFormularios/stepCadastroRepresentante";
import FormDadosEstabelecimento from './stepsFormularios/stepCadastroEstabelecimento';
import FormDirectorTecnico from "./stepsFormularios/stepCadastroDirectorTecnico";
import { Alert, Box, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import cadastrosService from "../../../../../services/cadastroServices";
import MessageError from "../../../../../messages/messageError";
import LoadingBackdrop from "../../../../../load/loadingBackdrop";
import api from "../../../../../services/api";
import { useNavigate } from 'react-router-dom';
import NavigateNext from '@mui/icons-material/NavigateNext';
// validate
import {
    validacaoDadosEmpresa,
    validacaoDadosRepresentante,
    validacaoDadosEstabelecimento,
    validacaoDadosDirectorTecnico
} from "../../../../../validacoes"

const useStyles = makeStyles((theme) => ({
    backButton: {
        marginRight: 'auto',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },

    forms: {
        display: 'flex',
        marginTop: 20,
        padding: 10,
    },
}));

export default function CadastroEstabelecimento({ agenda, setTempoRestante, message, tipoRegisto }) {
    // agenda, ESTA VARIAVEL USADA QUANDO UM LECINECIAMENTO É FEITO POR UM UTENTE APARTIR DO SITE.
    // setTempoRestante, ESTA VARIAVEL É UMA FUNCAO QUE USADA QUANDO UM LECINECIAMENTO É FEITO POR UM UTENTE APARTIR DO SITE, PARA ZERAR O CRONOMETRO APOS SUBMICAO DO LICENCIAMENTO.
    //  message, ESTA VARIAL EXIBE TRAS AS MENSAGENS DO COMPONENTE PAI, NESTE INFORMA SE AGENDA SELECIONA JA FOI OCUPADA.
    //  tipoRegisto, ESTA VARIAVEL DEFINE O TIPO DE RESIDTO A SER APLICADO, A INSERCAO OU ISCRICAO.

    const navigate = useNavigate()
    const classes = useStyles()
    const [errorMessage, setErrorMessage] = useState(message)
    const [open, setOpen] = useState(false);
    const dadosEmpresa = useSelector(state => state.dadosEmpresa.data)
    const dadosRepresentante = useSelector(state => state.dadosRepresentante.data)
    const dadosdirectorTecnico = useSelector(state => state.dadosdirectorTecnico.data)
    const cadastroEstabelecimento = useSelector(state => state.dadosCadastroEstabelecimento.data)
    const user = useSelector(state => state.account.user);
    const dispatch = useDispatch()
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    // CONTROLO DE ABANDONO NO PROCESSO DE LICENCIAMENTO
    const [isCadastroIncompleto, setIsCadastroIncompleto] = useState(true);
    const handleBeforeUnload = (event) => {
        if (isCadastroIncompleto) {
            const mensagem = 'Você tem um cadastro em andamento. Tem certeza de que deseja sair?';
            event.returnValue = mensagem; // Padrão para navegadores mais antigos (ex: Internet Explorer)
            return mensagem; // Padrão para navegadores modernos
        }
    };

    const handlePopState = () => {
        // Tratamento adicional para o botão de voltar
        // Você pode decidir o que fazer aqui, como mostrar um alerta
        // console.log('Botão de voltar pressionado');
    };

    // USEEFFECT PARA CONTROLAR ALGUNS COMPORTAMENTOS DO NAVEGADOR
    useEffect(() => {
        // RELOAD
        window.addEventListener('beforeunload', handleBeforeUnload);
        // BOTAO VOLTAR
        window.addEventListener('popstate', handlePopState);
        // MODAR DE PAGINA
        // window.addEventListener('popstate', handlePageChange);

        // Remove o evento antes de desmontar o componente
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
            // window.removeEventListener('popstate', handlePageChange);
        };
    }, [isCadastroIncompleto]);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };


    //FUNCAO MAIN PARA INCIAR O PROCESSO DE TODOS CADASTRAMENTO
    async function submitCadastroEstabelecimento() {
        setErrorMessage('')

        try {
            if (!dadosRepresentante?._id) {
                await createRepresentante();
            }

            // await new Promise(resolve => setTimeout(resolve, 3000));

            if (!localStorage.getItem('empresaId') && !dadosEmpresa?._id) {
                await createEmpresa(dadosRepresentante._id);
            }

            if (!dadosdirectorTecnico?._id) {
                await createDirectorTecnico();
            }

            // await new Promise(resolve => setTimeout(resolve, 10000));

            if (dadosEmpresa?._id && dadosdirectorTecnico?._id) {
                await createEstabelecimento(dadosdirectorTecnico._id);
            }

        } catch (error) {
            // console.error('Ocorreu um erro:', error);
        }
    }

    //FUNCAO PARA PREENCHER A AGENDA SELECIONADA
    const agendaFill = async (id) => {
        await api.patch('/agenda/fill',
            {
                // data: {
                'userId': user?._id ?? '',
                'agendaId': agenda._id,
                'estabelecimentoId': id
                // }
            })
            .then(response => {
                // console.log(response)

            }).catch(err => {
                // console.log(err)
                setErrorMessage(err.response.data.message)
            })
    }

    //FUNCAO PARA CADASTRAR REPRESENTANTE DA EMPRESA
    async function createRepresentante() {
        setOpen(true)

        try {
            const result = await cadastrosService.cadastroRepresentante(dadosRepresentante, user)
            localStorage.setItem('representanteId', result.data.representante._id);
            setOpen(false)

            // console.log(result)
            dispatch({
                type: 'dadosRepresentante',
                payload: { dadosRepresentante: result.data.representante }
            })

            // CRIAR A EMPRESA APOS OBTER O RESULTADO SUCCESS DA CRIACAO DO REPRESENTANTE
            await createEmpresa(result.data.representante._id);

            return result;
        } catch (error) {

            setActiveStep(1)
            // console.log(error)
            setErrorMessage(error.response.data.message)
            setOpen(false)

            throw error;
        }
    }

    //FUNCAO PARA CADASTRAR A EMPRESA
    async function createEmpresa(representanteId) {
        setOpen(true)

        try {
            const result = await cadastrosService.cadastroEmpresa(dadosEmpresa, representanteId, user)
            localStorage.setItem('empresaId', result.data.empresa._id);

            // console.log(result)
            setOpen(false)
            dispatch({
                type: 'dadosEmpresa',
                payload: { dadosEmpresa: result.data.empresa }
            })

            // ENVIAR EMAIL DE CADASTRO PARA O REPRESENTANTE DA EMPRESA
            const msg = {
                to: result.data.empresa?.representante?.dadosPessoais.email,
                subject: 'Registo de Representante',
                html: `<h1>Representante Registado Com Sucesso</h1>
                <p>
                  Parabéns Sr(a). ${result.data.empresa?.representante?.dadosPessoais.nome}, foi registado como representante da 
                  empresa ${result.data.empresa?.nome} na Agencia Reguladora de Medicamentos e Tecnólogia 
                  da Saúde -(ARMED).
                </p>
        
                <p><b>Nota:</b> Este e-mail foi gerado automaticamente pela plataforma <b>ARMED</b></p>
                `,
            };

            if (tipoRegisto === 'Inscrição') {

                api.post('/email/send', msg)
                    .then(response => {
                        // console.log(response)
                    }).catch(err => {
                        // console.log(err) 
                    })
            }

            return result;

        } catch (error) {

            // console.log(error)
            setOpen(false)
            setActiveStep(0)
            setErrorMessage(error.response.data.message)

            // Lançar erro se desejar propagá-lo
            throw error;
        }
    }

    //FUNCAO PARA CADASTRAR O DIRECTOR TECNICO
    async function createDirectorTecnico() {
        setOpen(true)

        try {
            const result = await cadastrosService.cadastroDirectorTecnico(dadosdirectorTecnico, user, dadosRepresentante)
            // console.log(result)
            setOpen(false)

            dispatch({
                type: 'dadosdirectorTecnico',
                payload: { dadosdirectorTecnico: result.data.directorTecnico }
            })

            // CRIAR O ESTABELECIMENTO APOS OBTER O RESULTADO SUCCESS DA CRIACAO DO DIRECTOR TECNICO
            await createEstabelecimento(result.data.directorTecnico._id);

            return result;
        } catch (error) {

            // console.log(error)
            setOpen(false)
            setActiveStep(3)
            setErrorMessage(error.response.data.message)

            // Lançar erro se desejar propagá-lo
            throw error;
        }
    }

    //FUNCAO PARA CADASTRAR O ESTABELECIMENTO
    async function createEstabelecimento(directorTecnicoId) {
        setOpen(true)

        try {

            const result = await cadastrosService.cadastroEstabelecimento(tipoRegisto, cadastroEstabelecimento, user, directorTecnicoId, dadosEmpresa)

            // console.log(result)

            // PREENCHER A AGENDA SELECIONADA CASO FOR UMA INSCRICAO POR AGENDAMENTO
            if (agenda) {
                await agendaFill(result.data.estabelecimento._id);
                setTempoRestante(0)
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setIsCadastroIncompleto(false);

            localStorage.removeItem('empresaId');

            // REMOVER AGENDA SELECIONDA DO STATE DA APLICACAO
            dispatch({
                type: 'agenda',
                payload: {
                    agenda: null
                }
            })

            // ENVIAR EMAIL DE CADASTRO PARA O DIRECTOR TECNICO
            const msg = {
                to: result.data.estabelecimento?.directorTecnico?.dadosPessoais.email,
                subject: 'Registo de DirectorTecnico',
                html: `<h1>Director Técnico Registado Com Sucesso</h1>
                <p>
                Parabéns ${result.data.estabelecimento?.directorTecnico?.dadosPessoais.nome} foi registado como Director Técnico 
                para o estabelecimento <b>${result.data.estabelecimento?.nome}</b>. O processo está em análise, cumprindo todos
                os requisitos, em altura oportuna enviaremos um email a confirmar a aprovação.  
                </p>
                <p><b>Nota:</b> Este e-mail foi gerado automaticamente pela plataforma <b>ARMED</b></p>
        `,
            };

            if (tipoRegisto === 'Inscrição') {
                await api.post('/email/send', msg)
                    .then(response => {
                        // console.log(response)
                    }).catch(err => {
                        // console.log(err) 
                    })
            }

            return navigate(`/utente/meu-recibo/${result.data.estabelecimento?._id}`);

        } catch (error) {

            // console.log(error)
            setActiveStep(2)
            setErrorMessage(error.response.data.message)

            throw error;
        } finally { setOpen(false) }
    }


    function getSteps() { return ['Dados da Empresa', 'Dados do Representante', 'Dados do Estabelecimento', 'Dados do Director Técnico'] }

    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <FormDadosEmpresa />;
            case 1:
                return <FormRepresentante />;
            case 2:
                return <FormDadosEstabelecimento tipoRegisto={tipoRegisto} />;
            case 3:
                return <FormDirectorTecnico />;
            default:
                return <FormDadosEmpresa />;
        }
    }


    // // ###################################################################
    const validateDadosEmpresa = async e => {
        setErrorMessage('');
        if (!(await validate0())) return
    };
    async function validate0() {
        try {
            await validacaoDadosEmpresa(dadosEmpresa)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        catch (error) {
            setErrorMessage(error);
        }
    }
    // // ###################################################################

    const validateDadosRepresentante = async e => {
        setErrorMessage('');
        if (!(await validate1())) return
    };

    async function validate1() {
        try {
            await validacaoDadosRepresentante(dadosRepresentante)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        catch (error) {
            setErrorMessage(error);
        }
    }
    // // ###################################################################

    const validateDadoEstabelecimento = async e => {
        setErrorMessage('');
        if (!(await validate2())) return
    };

    async function validate2() {
        try {
            await validacaoDadosEstabelecimento(cadastroEstabelecimento, tipoRegisto)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        catch (error) {
            setErrorMessage(error);
        }
    }
    // // ###################################################################


    const validateDadoDirectorTecnico_createEstabelecimento = async e => {
        setErrorMessage('');
        if (!(await validate3())) return
    };

    async function validate3() {
        try {
            await validacaoDadosDirectorTecnico(dadosdirectorTecnico)
            submitCadastroEstabelecimento()
        }
        catch (error) {
            setErrorMessage(error);
        }
    }
    // // ###################################################################


    // COMPONENTE PARA REUTITILIZAR O BOTAO NESTE STEP
    const ButtonNext = ({ disabled, title, onClick }) => {
        return (
            <Button disabled={disabled} style={{ background: '#85287e', width: 120 }} variant="contained" onClick={onClick} >
                {title} <NavigateNext />
            </Button>
        )
    }

    return (
        <Card style={{ marginBottom: 12 }}>

            <LoadingBackdrop open={open} />
            {errorMessage && <MessageError message={errorMessage} />}

            <Alert severity="warning"> <b>OBS: </b> Antes de inserir qualquer informação nos formulários use o recurso de  <b>Pesquisar dados</b>.</Alert>

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

            <Container >

                {/* BOX QUE EXIBE OS STEPS */}
                <Box> {getStepContent(activeStep)} </Box>
                {/* FIM BOX QUE EXIBE OS STEPS */}

                <div className={classes.forms}>

                    <Button
                        style={{ background: '#ebebf4' }}
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.backButton}
                    >
                        Voltar
                    </Button>

                    {/* CAIXA QUE SEPARA OS DOIS BUTTONS */}
                    <Box style={{ display: 'felx', flexGrow: 1 }} />

                    {/* A AÇÃO VAI DEPENDER DO TIPO DE REGISTO SELECIONADO */}
                    {activeStep === steps.length - 1 ?
                        <ButtonNext title={tipoRegisto == 'Inscrição' ? 'Cadastrar' : 'Enviar'} disabled={!dadosdirectorTecnico} onClick={() => dadosdirectorTecnico?._id ? submitCadastroEstabelecimento() : validateDadoDirectorTecnico_createEstabelecimento()} />
                        :
                        <>
                            {activeStep === 0 &&
                                <ButtonNext title={'Seguinte'} disabled={!dadosEmpresa} onClick={() => dadosEmpresa?._id ? handleNext() : validateDadosEmpresa()} />
                            }
                            {activeStep === 1 &&
                                <ButtonNext title={'Seguinte'} disabled={!dadosRepresentante} onClick={() => dadosRepresentante?._id ? handleNext() : validateDadosRepresentante()} />
                            }
                            {activeStep === 2 &&
                                <ButtonNext title={'Seguinte'} disabled={!cadastroEstabelecimento} onClick={() => validateDadoEstabelecimento()} />
                            }
                        </>
                    }
                </div>
            </Container>
        </Card>
    )
}
