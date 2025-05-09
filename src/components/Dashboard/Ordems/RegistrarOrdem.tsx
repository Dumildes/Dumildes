import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import verificado from '../../../assets/verificado.png'
import aviso from '../../../assets/aviso.png'
import BtnLoading from '../Loading/btnLoading'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import CNPApi from '../../../services/CNPApi';

interface Provincia {
    _id: string;
    designacao: string;
}

interface Municipio {
    _id: string;
    designacao: string;
}

interface Ordem {
    logoURL: File | string;
    sigla: string;
    designacao: string;
    tel: string;
    email: string;
    provincia: string;
    municipio: string;
    URL: string;
    local: string;
    profissao: string;
    prioridade: string;
    descricao: string;
}

const RegistrarOrdem: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const fileInput = useRef<HTMLInputElement>(null);

    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [errorMessange, setErrorMessange] = useState("");
    const [load, setLoad] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState('')
    const [showError, setShowError] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [image, setImage] = useState<string>('')
    const [ordem, setOrdem] = useState<Ordem>({
        logoURL: '',
        sigla: '',
        designacao: '',
        tel: '',
        email: '',
        provincia: '',
        municipio: '',
        URL: '',
        local: '',
        profissao: '',
        prioridade: '1',
        descricao: ''
    })

    const handleChangeOrdem = (event: any) => {
        if (event.target.files) {
            setOrdem({ ...ordem, [event.target.name]: event.target.files[0] });
            setImage(URL.createObjectURL(event.target.files[0]));
        } else {
            setOrdem({ ...ordem, [event.target.name]: event.target.value });
        }
    }

    const validateOrdemFields = (ordemField: Ordem) => {
        const errors = {
            logo: 'Faça o carregamento do Logotipo',
            sigla: 'Sigla é um campo obrigatorio',
            designacao: 'Por favor, preencha designação',
            tel: 'Insira o Contacto',
            email: 'O campo Email, não pode ser vazio',
            provincia: 'Selecione a província',
            URL: 'url',
            municipio: 'Selecione o município',
            local: 'Insira a morada',
            profissao: 'Insira  a profissão',
            descricao: 'Escreva alguma Descrição'
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const field in errors) {
            if (!ordemField[field as keyof Ordem]) {
                setErrorMessange(errors[field as keyof typeof errors]);
                setShowError(true)
                return false;
            } else if (!emailRegex.test(ordemField.email)) {
                setErrorMessange('Email inválido');
                setShowError(true);
                return false;
            }
        }
        handleRegistrarOrdem();
        return true;
    };

    const validatActualizacaoFields = (ordemField: Ordem) => {
        const errors = {
            sigla: 'Sigla é um campo obrigatorio',
            designacao: 'Por favor, preencha designação',
            tel: 'Insira o Contacto',
            email: 'O campo Email, não pode ser vazio',
            provincia: 'Selecione a província',
            URL: 'url',
            municipio: 'Selecione o município',
            local: 'Insira a morada',
            profissao: 'Insira  a profissão',
            descricao: 'Escreva alguma Descrição'
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const field in errors) {
            if (!ordemField[field as keyof Ordem]) {
                setErrorMessange(errors[field as keyof typeof errors]);
                setShowError(true)
                return false;
            } else if (!emailRegex.test(ordemField.email)) {
                setErrorMessange('Email inválido');
                setShowError(true);
                return false;
            }
        }

        handleRegistrarOrdem();
        return true;
    };

    const handleRegistrarOrdem = () => {
        setLoad(true)
        const formData = new FormData();
        formData.append('logo', ordem.logoURL);
        formData.append('designacao', ordem.designacao);
        formData.append('tel', ordem.tel);
        formData.append('email', ordem.email);
        formData.append('sigla', ordem.sigla);
        formData.append('descricao', ordem.descricao);
        formData.append('profissao', ordem.profissao);
        // formData.append('prioridade', ordem.prioridade);
        formData.append('serverURL', ordem.URL);
        formData.append('provincia', ordem.provincia);
        formData.append('municipio', ordem.municipio);
        formData.append('bairro', ordem.local);
        formData.append('userId', '');

        if (id) {
            CNPApi.put('/ordem/edit', {
                ...ordem, ordemId: id
            }).then(() => {
                setLoad(false)
                navigate(`/admin/ordem/detalhe/${id}`)
            }).catch(() => {
                setLoad(false)
            })
        } else {
            CNPApi.post('/ordem/register', formData)
                .then(res => {
                    setLoad(false)
                    setOpenModal(true)
                    setMessageSuccess(res.data.msg)
                }).catch(() => {
                    setLoad(false)
                    // setMessageSuccess()
                })
        }
    }

    useEffect(() => {
        CNPApi.get<{ provincias: Provincia[] }>('provincias')
            .then((response) => {
                setProvincias(response.data.provincias)
            })
            .catch(() => { setLoad(false)})

        if (id) {
            CNPApi.get(`/ordem/${id}`)
                .then(response => {
                    setOrdem(response.data.ordem)
                }).catch(() => setLoad(false))
        }
    }, [id])

    const buscarMunicipio = (id_provincia: string) => {
        CNPApi.get<{ municipios: Municipio[] }>(`/municipios-by-provincia/${id_provincia}`)
            .then((response) => {
                setMunicipios(response.data.municipios)
            })
            .catch(() => setLoad(false))
    }

    useEffect(() => {
        setTimeout(() => {
            setShowError(false);
        }, 6000);
    }, [errorMessange])

    return (
            <div className='registrar-home'>

                {showError && <div className="erroMessange"><p>{errorMessange}</p></div>}
                <Box
                    className='boxRegister'
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                >
                    <Button className='btnLogo' style={{ display: id ? 'none' : '' }}>
                        <div>
                            <Avatar sx={{ width: 80, height: 80 }} alt="Travis Howard" src={image || ordem.logoURL as string}
                                onClick={() => fileInput.current?.click()}
                            />
                            <input ref={fileInput} type="file" name='logo' onChange={handleChangeOrdem} style={{ display: 'none' }} />
                            Logo
                        </div>
                    </Button>
                    <TextField
                        style={{ width: id ? '47.6%' : '' }}
                        id="sigla" label="Sigla *"
                        value={ordem.sigla}
                        name='sigla' onChange={handleChangeOrdem} variant="outlined" className='sigla' />
                    <TextField id="designacao" label="Designação *"
                        value={ordem.designacao}
                        onChange={handleChangeOrdem} name='designacao' variant="outlined" className='desig' />
                    <TextField id="contacto" type='number' label="Contacto *"
                        value={ordem.tel} onChange={handleChangeOrdem} name='tel' variant="outlined" className='txtField' />
                    <TextField id="email" type='email' label="Email *"
                        value={ordem.email} onChange={handleChangeOrdem} name='email' variant="outlined" className='txtField' />
                    <TextField id="url" label="URL *"
                        value={ordem.URL} onChange={handleChangeOrdem} name='URL' variant="outlined" className='txtField' />

                    <TextField
                        id="provincia"
                        select
                        label="Provincia *"
                        name='provincia'
                        className='txtField'
                        onChange={handleChangeOrdem}
                        value={ordem.provincia}
                    >
                        {provincias.map((provincia) => (
                            <MenuItem key={provincia._id} onClick={() => buscarMunicipio(provincia._id)} value={provincia.designacao} className='provincia'>
                                {provincia.designacao}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        disabled={municipios.length > 0 ? false : ordem.municipio ? false : true}
                        id="municipio"
                        select
                        label="Municipio *"
                        name='municipio'
                        className='txtField'
                        onChange={handleChangeOrdem}
                        value={ordem.municipio}
                    >
                        {municipios.map((municipio) => (
                            <MenuItem key={municipio._id} value={municipio.designacao}>
                                {municipio.designacao}
                            </MenuItem>
                        ))}
                         <MenuItem style={{display: 'none'}} value={ordem.municipio}>
                                {ordem.municipio}
                            </MenuItem>
                    </TextField>
                    <TextField id="morada" label="Morada(Rua, Casa, Bairro) *"
                        value={ordem.local} onChange={handleChangeOrdem} name='local' variant="outlined" className='txtField' />

                    <TextField id="profissao" label="Profissão *"
                        value={ordem.profissao} onChange={handleChangeOrdem} name='profissao' variant="outlined" className='txtField' />
                    <TextField disabled id="prioridade" label="Prioridade *"
                        value={ordem.prioridade} onChange={handleChangeOrdem} name='prioridade' variant="outlined" className='txtField' />
                    <TextField
                        className='txtDesc'
                        id="descricao"
                        label="Descrição"
                        name='descricao'
                        multiline
                        rows={4}
                        onChange={handleChangeOrdem}
                        value={ordem.descricao}
                    />
                    <div className='btnSend'>
                        <Button variant="contained" disabled={load} onClick={() => { id ? validatActualizacaoFields(ordem) : validateOrdemFields(ordem) }}>{load ? <BtnLoading /> : id ? 'Actualizar' : 'CADASTRAR'}</Button>
                    </div>
                </Box>

                <Dialog
                    open={openModal}
                    className='modal-assinatura'
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div style={{ margin: 'auto', padding: '15px' }}>
                        {messageSuccess == 'Sucesso' ?
                            <img src={verificado} alt="" height={100} width={100} />
                            : <img src={aviso} alt="" height={100} width={100} />
                        }
                    </div>
                    {messageSuccess == 'Sucesso' ?
                        <p style={{ textAlign: 'center', fontWeight: '350' }}>Cadastro realizado com {messageSuccess}</p>
                        : <p style={{ textAlign: 'center', fontWeight: '350' }}>Alguma coisa deu errado, Tente Novamente!</p>}
                    <DialogActions>
                        {messageSuccess == 'Sucesso' ?
                            <Button onClick={() => { setOpenModal(false), navigate('/admin/ordem') }}>Fechar</Button>
                            : <Button onClick={() => { setOpenModal(false) }} style={{ color: '#E12025' }}>Tentar Novamente</Button>}
                    </DialogActions>
                </Dialog>
            </div >
    )
}

export default RegistrarOrdem
