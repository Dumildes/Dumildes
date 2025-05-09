import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import verificado from '../../../assets/verificado.png'
import aviso from '../../../assets/aviso.png'
import InputAdornment from '@mui/material/InputAdornment'
import BtnLoading from '../Loading/btnLoading'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import CNPApi from '../../../services/CNPApi';

interface Ordem {
    _id: string;
    nome: string;
}

interface Provincia {
    _id: string;
    designacao: string;
}

interface Municipio {
    _id: string;
    designacao: string;
}

interface AdminOrdem {
    ordem: string;
    fotoPerfil: File | string;
    nomeCompleto: string;
    dataNascimento: string;
    bi: string;
    dataEmissaoBI: string;
    nomePai: string;
    nomeMae: string;
    estadoCivil: string;
    provincia: string;
    municipio: string;
    morada: string;
    telefone_1: string;
    telefone_2: string;
    genero: string;
    nif: string;
    email: string;
    perfil: string;
}

const RegisterAdminOrdem: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const fileInput = useRef<HTMLInputElement>(null);

    const [ordens, setOrdens] = useState<Ordem[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [errorMessange, setErrorMessange] = useState("");
    const [load, setLoad] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState('')
    const [showError, setShowError] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [image, setImage] = useState<string>('')
    const [adminOrdem, setAdminOrdem] = useState<AdminOrdem>({
        ordem: '',
        fotoPerfil: '',
        nomeCompleto: '',
        dataNascimento: '',
        bi: '',
        dataEmissaoBI: '',
        nomePai: '',
        nomeMae: '',
        estadoCivil: '',
        provincia: '',
        municipio: '',
        morada: '',
        telefone_1: '',
        telefone_2: '',
        genero: '',
        nif: '',
        email: '',
        perfil: ''
    })

    const handleChangeOrdem = (event: any) => {
        if (event.target.files) {
            setAdminOrdem({ ...adminOrdem, [event.target.name]: event.target.files[0] })
            setImage(URL.createObjectURL(event.target.files[0]));
        } else {
            setAdminOrdem({ ...adminOrdem, [event.target.name]: event.target.value })
        }
    }

    const validateadminOrdemFields = (adminOrdem: AdminOrdem) => {
        const errors = {
            fotoPerfil: 'Faça o carregamento da foto de Perfil',
            ordem: 'Selecione Uma Ordem',
            nomeCompleto: 'Insira o nome Completo',
            dataNascimento: 'Selecione a data de Nascimento',
            bi: 'Insira o Portador do BI',
            dataEmissaoBI: 'Selecione a data de Emissão',
            nomePai: 'Insira o nome do Pai',
            nomeMae: 'Insira o nome da Mãe',
            estadoCivil: 'Insiara o Estado Civil',
            provincia: 'Selecione uma Província',
            municipio: 'Selecione um municipio',
            morada: 'Insira a morada, bairro, rua',
            telefone_1: 'Insira o número de Telefone',
            genero: 'Descreva o gênero',
            email: 'Digite um email',
            perfil: 'Descreva o Perfil'
        };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const field in errors) {
            if (!adminOrdem[field as keyof AdminOrdem]) {
                setErrorMessange(errors[field as keyof typeof errors]);
                setShowError(true)
                return false;
            } else if (!emailRegex.test(adminOrdem.email)) {
                setErrorMessange('Email inválido');
                setShowError(true);
                return false;
            }
        }

        handleRegister();
        return true;
    };

    const handleRegister = () => { }

    useEffect(() => {
        CNPApi.get('ordems')
            .then(res => {
                setLoad(false)
                setOrdens(res.data.ordens);
            }).catch(() => setLoad(false))
    }, [])

    useEffect(() => {
        CNPApi.get('provincias')
            .then((response) => {
                setProvincias(response.data.provincias)
            })
            .catch(() => setLoad(false))
    }, [])

    const buscarMunicipio = (id_provincia: string) => {
        CNPApi.get(`/municipios-by-provincia/${id_provincia}`)
            .then((response) => {
                setMunicipios(response.data.municipios);
                setMessageSuccess('sucesso')
            })
            .catch(() => setLoad(false))
    }

    useEffect(() => {
        setTimeout(() => {
            setShowError(false);
        }, 4000);
    }, [errorMessange])

    return (
        <div className='admin-registre'>
            {showError ? <div className='erroMessange'> <p >{errorMessange}</p> </div> : <p></p>}
            <Box
                className='admin-box'
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <Button className='btnLogo'>
                    <div style={{ alignContent: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80 }} alt="Travis Howard" src={image}
                            onClick={() => fileInput.current?.click()}
                        />
                        <input ref={fileInput} type="file" name='fotoPerfil' onChange={handleChangeOrdem} style={{ display: 'none' }} />
                        Foto
                    </div>
                </Button>
                <TextField
                    style={{ width: id ? '47.6%' : '' }}
                    id="ordem"
                    label="Ordem *"
                    name='ordem'
                    select
                    onChange={handleChangeOrdem}
                    className='sigla'
                >
                    {ordens.map((ordem) => (
                        <MenuItem key={ordem._id} value={ordem.nome} className='provincia'>
                            {ordem.nome}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField id="nomeCompleto" label="Nome Completo *" onChange={handleChangeOrdem} name='nomeCompleto' variant="outlined" className='desig' />
                <TextField
                    label="Data Nascimento"
                    id='dataNascimento'
                    name='dataNascimento'
                    type='date'
                    onChange={handleChangeOrdem}
                    className='txtField'
                    sx={{ m: 1, width: '25ch' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                    }}
                />
                <TextField id="bi" label='Portador BI *' onChange={handleChangeOrdem} name='bi' variant="outlined" className='txtField' />
                <TextField
                    label="Data Emissão B.I *"
                    id='dataEmissaoBi'
                    name='dataEmissaoBI'
                    type='date'
                    onChange={handleChangeOrdem}
                    sx={{ m: 1, width: '25ch' }}
                    className='txtField'
                    InputProps={{
                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                    }}
                />

                <TextField id="nomePai" label="Nome do Pai *" onChange={handleChangeOrdem} name='nomePai' variant="outlined" className='txtField' />
                <TextField id="nomeMae" label="Nome da Mãe *" onChange={handleChangeOrdem} name='nomeMae' variant="outlined" className='txtField' />
                <TextField id="estadoCivil" label="Estado Civil *" onChange={handleChangeOrdem} name='estadoCivil' variant="outlined" className='txtField' />

                <TextField
                    id="provincia"
                    select
                    label="Provincia *"
                    name='provincia'
                    className='txtField'
                    onChange={handleChangeOrdem}
                >
                    {provincias.map((provincia) => (
                        <MenuItem key={provincia._id} onClick={() => buscarMunicipio(provincia._id)} value={provincia.designacao} className='provincia'>
                            {provincia.designacao}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    disabled={municipios.length > 0 ? false : adminOrdem.municipio ? false : true}
                    id="municipio"
                    select
                    label="Municipio *"
                    name='municipio'
                    className='txtField'
                    onChange={handleChangeOrdem}
                    value={adminOrdem.municipio}
                >
                    {municipios.map((municipio) => (
                        <MenuItem key={municipio._id} value={municipio.designacao}>
                            {municipio.designacao}
                        </MenuItem>
                    ))}
                    <MenuItem style={{ display: 'none' }} value={adminOrdem.municipio}>
                        {adminOrdem.municipio}
                    </MenuItem>
                </TextField>
                <TextField id="morada" label="Morada(Bairro, Rua) *" onChange={handleChangeOrdem} name='morada' variant="outlined" className='txtField' />

                <TextField id="telefone_1" label="Telefone 1 *" onChange={handleChangeOrdem} name='telefone_1' variant="outlined" className='txtField' />
                <TextField id="telefone_2" label="Telefone 2" onChange={handleChangeOrdem} name='telefone_2' variant="outlined" className='txtField' />
                <TextField id="genero" label="Genero *" onChange={handleChangeOrdem} name='genero' variant="outlined" className='txtField' />
                <TextField id="nif" label="Nif" onChange={handleChangeOrdem} name='nif' variant="outlined" className='txtField' />
                <TextField id="email" label="Email *" onChange={handleChangeOrdem} name='email' variant="outlined" className='txtField' />
                <TextField
                    id="perfil"
                    select
                    label="Perfil *"
                    name='perfil'
                    className='txtField'
                    onChange={handleChangeOrdem}
                >
                    <MenuItem value='###'>
                        ####
                    </MenuItem>
                </TextField>

                <div className='btnSend'>
                    <Button variant="contained" disabled={load} onClick={() => { validateadminOrdemFields(adminOrdem) }}>
                        {load ? <BtnLoading /> : 'CADASTRAR'}
                    </Button>
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

export default RegisterAdminOrdem
