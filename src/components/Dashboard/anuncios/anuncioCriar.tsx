import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, TextField, Button, MenuItem, Dialog, DialogActions } from '@mui/material';
import CNPApi from '../../../services/CNPApi';
import foto from '../../../assets/foto.png'
import verificado from '../../../assets/verificado.png'
import aviso from '../../../assets/aviso.png'
import BtnLoading from '../Loading/btnLoading';

interface Emolumento {
    _id: string;
    designacao: string;
    montante: string;
}

interface Anuncio {
    imagens: File | string;
    titulo: string;
    designacao: string;
    tipo: string;
    link: string;
    descricao: string;
    emolumentos: string;
    anuncianteId: string;
    emolumentoId: string;
}

const AnuncioCriar: React.FC = () => {
    const navigate = useNavigate();
    const fileInput = useRef<HTMLInputElement>(null);

    const params = useParams<{ id: string }>();

    const [load, setLoad] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [messageSuccess, setMessageSuccess] = useState<string>('');
    const [errorMessange, setErrorMessange] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [emolumentos, setEmolumentos] = useState<Emolumento[]>([]);
    const [anuncioImagePreview, setAnuncioImagePreview] = useState<string>('');
    const [anuncio, setAnuncio] = useState<Anuncio>({
        imagens: '',
        titulo: '',
        designacao: '',
        tipo: '',
        link: '',
        descricao: '',
        emolumentos: '',
        anuncianteId: params.id || '',
        emolumentoId: ''
    });

    const handleAnuncioChange = (event: any) => {
        if (event.target.files) {
            setAnuncio({ ...anuncio, [event.target.name]: event.target.files[0] });
            setAnuncioImagePreview(URL.createObjectURL(event.target.files[0]));
        } else {
            setAnuncio({ ...anuncio, [event.target.name]: event.target.value });
        }
    };

    const validateFields = (anuncioField: Anuncio): boolean => {
        const errors: { [key in keyof Anuncio]?: string } = {
            imagens: 'faça o upload da imagem',
            titulo: 'Insira um título',
            designacao: 'Descreva a designação',
            tipo: 'Descreva o tipo de anúncio',
            link: 'Insira um link',
            descricao: 'Faça a descrição',
            emolumentoId: 'Escolha um Emolumento',
        };

        for (const field in errors) {
            if (!anuncioField[field as keyof Anuncio]) {
                setErrorMessange(errors[field as keyof Anuncio] as string);
                setShowError(true);
                return false;
            }
        }
        createAnuncio();
        return true;
    };

    const createAnuncio = () => {
        setLoad(true)
        const formData = new FormData();
        formData.append('imagens', anuncio.imagens);
        formData.append('anuncianteId', anuncio.anuncianteId);
        formData.append('emolumentoId', anuncio.emolumentoId);
        formData.append('titulo', anuncio.titulo);
        formData.append('tipo', anuncio.tipo);
        formData.append('descricao', anuncio.descricao);
        formData.append('link', anuncio.link);

        CNPApi.post('/anuncio/create', formData)
            .then(res => {
                console.log("msm: ", res)
                setLoad(false)
                setOpenModal(true)
                setMessageSuccess(res.data.msg)
            }).catch(err => {
                setErrorMessange(err.data.message);
                setLoad(false)
                setOpenModal(true)
            })

        setAnuncio({
            imagens: '',
            titulo: '',
            designacao: '',
            tipo: '',
            link: '',
            descricao: '',
            emolumentos: '',
            anuncianteId: '',
            emolumentoId: ''
        });
    }

    useEffect(() => {
        CNPApi.get<{ emolumentos: Emolumento[] }>('/emolumentos')
            .then(res => {
                setEmolumentos(res.data.emolumentos);
            }).catch(err => {
                if (err.message === "Network Error") {
                    setErrorMessange(err.message)
                }
            })
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [errorMessange]);


    return (
        <div className='registrar-anuncio'>
            {showError ? <div className='erroMessange'> <p >{errorMessange}</p> </div> : <p></p>}
            <div className='anuncioImage' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px', marginTop: '50px' }}
                onClick={() => fileInput.current?.click()}>
                <img src={foto} alt="" style={{ maxWidth: '450px', maxHeight: '300px', marginTop: '70px', display: anuncioImagePreview ? 'none' : '' }} />
                <img src={anuncioImagePreview} alt="" style={{ maxWidth: '450px', maxHeight: '300px', marginTop: '10px' }} />
                <input ref={fileInput} type="file" name='imagens' style={{ display: 'none' }} onChange={handleAnuncioChange} />
            </div>
            <Box
                className='boxRegister'
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField id="titulo" name='titulo' value={anuncio.titulo} label="Título *" variant="outlined" className='titulo-anu' onChange={handleAnuncioChange} />
                <TextField id="designacao" label="Designação *" value={anuncio.designacao} name='designacao' variant="outlined" className='titulo-anu' onChange={handleAnuncioChange} />

                <TextField
                    id="tipo"
                    select
                    label="Tipo *"
                    name='tipo'
                    className='txtField'
                    onChange={handleAnuncioChange}
                    value={anuncio.tipo}
                >
                    <MenuItem value="Vaga">
                        Vaga
                    </MenuItem>
                    <MenuItem value="Producto">
                        Produto
                    </MenuItem>
                    <MenuItem value="Serviço">
                        Serviço
                    </MenuItem>
                    <MenuItem value="Evento">
                        Evento
                    </MenuItem>
                </TextField>

                <TextField id="descricao" label="Descrição *" value={anuncio.descricao} name='descricao' variant="outlined" className='txtField' onChange={handleAnuncioChange} />
                <TextField id="link" label="Link *" name='link' value={anuncio.link} variant="outlined" className='txtField' onChange={handleAnuncioChange} />

                <TextField
                    id="emolumentos"
                    select
                    label="Emolumentos *"
                    name="emolumentos"
                    className="txtField"
                    value={anuncio.emolumentoId}
                    onChange={(e) => {
                        const selected = emolumentos.find(em => em._id === e.target.value);
                        setAnuncio({
                            ...anuncio,
                            emolumentoId: selected?._id || '',
                            emolumentos: selected ? `${selected.designacao}-${selected.montante}` : ''
                        });
                    }}
                >
                    {emolumentos.map((emolumento) => (
                        <MenuItem key={emolumento._id} value={emolumento._id}>
                            {emolumento.designacao}-{emolumento.montante}
                        </MenuItem>
                    ))}
                </TextField>


                <div className='btnSend' style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '18px' }}>
                    <Button variant="contained" disabled={load} onClick={() => { validateFields(anuncio) }}>{load ? <BtnLoading /> : 'SALVAR'}</Button>
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
                        <Button onClick={() => { setOpenModal(false), navigate('/admin/anuncios') }}>Fechar</Button>
                        : <Button onClick={() => { setOpenModal(false) }} style={{ color: '#E12025' }}>Tentar Novamente</Button>}
                </DialogActions>
            </Dialog>

        </div >
    )
}

export default AnuncioCriar
