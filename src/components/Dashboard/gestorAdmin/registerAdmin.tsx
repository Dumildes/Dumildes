import { Avatar, Box, Button, Card, Container, DialogActions, MenuItem, Paper, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CNPApi from '../../../services/CNPApi';
import avatar from '../../../assets/fotoInscricao.jpeg'
import MessageSuccess from '../../../messages/messageSuccess';
import MessageError from '../../../messages/messageError';
import LoadingBackdrop from '../../load/loadingBackdrop';
import { useAuth } from '../../../contexts/AuthProvider';

interface User{}

const RegisterAdmin: React.FC = () => {
    const auth = useAuth();

    const defaultUser: User = {
        dadosPessoais: {
            nome: '',
            fotoURL: ''
        },
        tipo: '',
        funcao: '',
        _id: ''
    };

    const user: User = auth.user as User || defaultUser;

    const navegate = useNavigate()
    const [dadosAdmin, setDadosAdmin] = useState({
        foto:'',
        nome:'',
        numeroBI:'',
        email:'',
        tel1:'',
        tel2:'',
        genero:'',
        municipio:'',
        nomunicipiome:'',
        bairro:'',
        rua:'',
        dataNascimento:'',
        estadoCivil:'',
        provincia:'',
    })
    const [municipios, setMunicipios] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [messageSuccess, setMessageSuccess] = useState('')
    const [messageError, setErrorMessage] = useState('')
    const [load, setLoad] = useState(false)
    const [perfil, setPerfil] = useState({
        perfil:'',
    })

    useEffect(() => {
        CNPApi.get('/provincias')
            .then(res => {
                setProvincias(res.data.provincias);
            }).catch(() => '')
    }, [setProvincias])

    const HandleChange = (e: any) => {
        e.target.files ?
            setDadosAdmin({ ...dadosAdmin, [e.target.name]: e.target.files[0] })
            :
            setDadosAdmin({ ...dadosAdmin, [e.target.name]: e.target.value })

        e.target.name === 'provincia' &&
            CNPApi.get(`/municipios-by-provincia/${e.target.value._id}`)
                .then(res => {
                    setMunicipios(res.data.municipios);
                }).catch(() => '')
    }
    // dadosAdmin?.provincia.designacao ??
    const createAdmin = () => {
        const formData = new FormData();
        formData.append('foto', dadosAdmin?.foto ?? '');
        formData.append('nome', dadosAdmin?.nome ?? '');
        formData.append('numeroBI', dadosAdmin?.numeroBI ?? '');
        formData.append('email', dadosAdmin?.email ?? '');
        formData.append('tel1', dadosAdmin?.tel1 ?? '');
        formData.append('tel2', dadosAdmin?.tel2 ?? '');
        formData.append('genero', dadosAdmin?.genero ?? '');
        formData.append('provincia', 'Luanda');
        formData.append('municipio', dadosAdmin?.municipio ?? 'Luanda');
        formData.append('bairro', dadosAdmin?.bairro ?? '');
        formData.append('rua', dadosAdmin?.rua ?? '');
        formData.append('userId', user?._id ?? '');
        formData.append('dataNascimento', dadosAdmin?.dataNascimento ?? '');
        formData.append('estadoCivil', dadosAdmin?.estadoCivil ?? '');
        formData.append('perfil', perfil.perfil);

        // formData.forEach((value, key) => {
        //     console.log(key, value);
        // });


        setLoad(true)
        setErrorMessage('')
        setMessageSuccess('')

        CNPApi.post('/admin/register', formData)
            .then(res => {
                setLoad(false)
                console.log(res)
                setMessageSuccess(res.data.msg)
                navegate('/admin/lista-de-administradores')

            }).catch(error => {
                setErrorMessage(error.response.data.message)
                setLoad(false)
            })
    }

    const perfils = [
        { 'designacao': 'Admistrador', 'perfil': 'Admistrador' },
        { 'designacao': 'CNP', 'perfil': 'CNP' },
    ]

    return (
        <div style={{ marginTop: '50px' }} >
            <Container>
                <Card style={{ padding: 20 }}>

                    {messageSuccess && <MessageSuccess message={messageSuccess} />}
                    {messageError && < MessageError message={messageError} />}
                    <LoadingBackdrop open={load} text={`A cadastrar ${' ' + dadosAdmin?.nome}`} />

                    <Container className='flex  flex-col md:flex-row justify-between  mb-4 gap-3'>
                        <Paper style={{ border: '1px dashed #3e3d3f' }} className=' size-[200px]'>
                            <label htmlFor="foto" style={{ cursor: 'pointer', textAlign: 'center' }}>
                                {dadosAdmin?.foto ?
                                    <>
                                        <Avatar style={{
                                            height: 198,
                                            width: 165
                                        }} className='object-cover size-full' variant="square" src={URL.createObjectURL(dadosAdmin?.foto)} title="Clique para carregar uma imagem" />
                                    </>
                                    :

                                    <img src={avatar} alt="" className='object-cover size-full' />
                                }
                                <input accept="image/png, image/jpg, image/jpeg" type="file" name="foto" id="foto" style={{ display: 'none' }} onChange={HandleChange} />
                            </label>
                        </Paper>

                        <Box className='w-full'>
                            <TextField
                                type="text"
                                required
                                label="Nome"
                                fullWidth
                                name="nome"
                                variant="outlined"
                                onChange={HandleChange}
                            />

                            <TextField
                                style={{ marginTop: 15 }}
                                type="text"
                                required
                                label="Número de B.I"
                                fullWidth
                                name="numeroBI"
                                variant="outlined"
                                onChange={HandleChange}
                            />
                            {/* <Box className='grid grid-cols-1 md:grid-cols-2 gap-2 mb-2'> */}
                            <TextField
                                style={{ marginTop: 10 }}
                                type="text"
                                label="Perfil"
                                select
                                fullWidth
                                name="perfil"
                                variant="outlined"
                                onChange={HandleChange}
                            >
                                {perfils.map((perfil) => (
                                    <MenuItem onClick={() => setPerfil(perfil)} key={perfil.designacao} value={perfil.designacao}>
                                        {perfil.designacao}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* </Box> */}
                        </Box>
                    </Container>

                    <Container className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-2'>
                        <Box className=''>
                            <TextField
                                type="text"
                                label="Genero"
                                select
                                fullWidth
                                name="genero"
                                variant="outlined"
                                onChange={HandleChange}
                            >
                                <MenuItem key={'M'} value={'M'} name="genero">
                                    Masculino
                                </MenuItem>
                                <MenuItem key={'F'} value={'F'} name="genero">
                                    Feminino
                                </MenuItem>
                            </TextField>
                        </Box>

                        <Box className=''>
                            <TextField
                                fullWidth
                                label="Data de Nascimento"
                                type="date"
                                name="dataNascimento"
                                variant="outlined"
                                onChange={HandleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>

                        <Box className=''>
                            <TextField
                                type="text"
                                label="Estado civil"
                                select
                                fullWidth
                                name="estadoCivil"
                                variant="outlined"
                                onChange={HandleChange}
                            >
                                <MenuItem key="s" value="Solteiro(a)">
                                    Solteiro(a)
                                </MenuItem>
                                <MenuItem key="c" value="Casado(a)">
                                    Casado(a)
                                </MenuItem>
                                <MenuItem key="d" value="Divorciado(a)">
                                    Divorciado(a)
                                </MenuItem>
                                <MenuItem key="v" value=" Viúvo(a)">
                                    Viúvo(a)
                                </MenuItem>
                            </TextField>
                        </Box>
                    </Container>

                    <Container className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-2'>

                        <Box className=''>
                            <TextField
                                type="text"
                                required
                                label="Telefone1"
                                fullWidth
                                name="tel1"
                                variant="outlined"
                                onChange={HandleChange}
                            />
                        </Box>

                        <Box className=''>
                            <TextField
                                type="text"
                                label="Telefone2"
                                fullWidth
                                name="tel2"
                                variant="outlined"
                                onChange={HandleChange}
                            />
                        </Box>
                        <Box className=''>
                            <TextField
                                type="email"
                                required
                                label="Email"
                                fullWidth
                                name="email"
                                variant="outlined"
                                onChange={HandleChange}
                            />
                        </Box>
                    </Container>

                    <Container className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-2'>

                        <Box className=''>
                            <TextField
                                required
                                type="text"
                                label="Provincia"
                                select
                                fullWidth
                                name="provincia"
                                variant="outlined"
                                onChange={HandleChange}
                            >
                                {provincias?.map((provincia) => (
                                    <MenuItem key={provincia._id} value={provincia}>
                                        {provincia.designacao}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box className=''>
                            {dadosAdmin?.provincia ?
                                <TextField
                                    required
                                    type="text"
                                    label="Municipio"
                                    select
                                    fullWidth
                                    name="municipio"
                                    variant="outlined"
                                    onChange={HandleChange}
                                >
                                    {municipios?.map((municipio) => (
                                        <MenuItem key={municipio._id} value={municipio}>
                                            {municipio.designacao}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                :
                                <TextField
                                    type="text"
                                    disabled
                                    label="Municipio"
                                    fullWidth
                                    variant="outlined"
                                />
                            }
                        </Box>

                        <Box className=''>
                            <TextField
                                required
                                type="text"
                                label="Bairro"
                                fullWidth
                                name="bairro"
                                variant="outlined"
                                onChange={HandleChange}
                            />

                        </Box>
                        <Box className=''>
                            <TextField
                                required
                                type="text"
                                label="Rua"
                                fullWidth
                                name="rua"
                                variant="outlined"
                                onChange={HandleChange}
                            />
                        </Box>
                    </Container>

                    <DialogActions>
                        <Button
                            disabled={!dadosAdmin.nome}
                            className='py-2' variant="contained" color='secondary' style={{ background: '#E12025' }}
                            onClick={createAdmin}
                        >
                            Cadastrar
                        </Button>
                    </DialogActions>
                </Card>
            </Container>
        </div>
    )
}

export default RegisterAdmin;
