import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Avatar, Menu, MenuItem, Button, Dialog, DialogActions, Slide } from '@mui/material';
import Loading from '../Loading/loading'
import InformacaoGeral from './InformacaoGeral'
import Assinatura from './Assinatura'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import CNPApi from '../../../services/CNPApi';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Ordem {
    _id: string;
    status: string;
    sigla: string;
    logoURL: string;
    nome: string;
    local: string;
    descricao: string;
    approved: boolean;
    prioridade: string;
    profissao: string;
    email: string;
    tel: string;
    municipio: string;
    provincia: string;
    URL: string;
    serverURL: string;
    assinaturaPR: string;
}

const OrdemDetalhe = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const fileInput = useRef<HTMLInputElement | null>(null);

    const [ordem, setOrdem] = useState<Ordem | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>('');
    const [aprovado, setAprovado] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalAprovar, setOpenAprovar] = useState(false);
    const [openModalStatus, setOpenStatus] = useState(false);
    const [infoTextAprove, setInfoTextAprove] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [logo, setLogo] = useState<File | null>(null);
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [anchorElStatus, setAnchorElStatus] = useState<null | HTMLElement>(null);
    const openStatus = Boolean(anchorElStatus);

    const handleClickStatus = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElStatus(event.currentTarget);
    };
    const handleCloseStatus = () => {
        setAnchorElStatus(null);
    };

    const getStatusBackgroundColor = (status: string) => {
        switch (status) {
            case 'Activo': return 'rgba(124, 236, 54, 0.757)';
            case 'Inactivo': return '#E32D2D';
            case 'Demo': return '#00C2FE';
            default: return '#FBAF1B';
        }
    };


    const changeLogo = () => {
        if (logo && ordem) {
            setLoading(true);
            const formData = new FormData();
            formData.append('logo', logo);
            formData.append('ordemId', ordem._id);
            CNPApi.patch('/ordem/change-logo', formData)
                .then((response) => {
                    setLoading(false);
                    setOrdem(response.data.ordem);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }

    const deleteOrdem = () => {
        setLoading(true);

        if (ordem?._id) {
            CNPApi.delete('/ordem/delete', {
                data: {
                    ordemId: ordem?._id
                }
            })
                .then(() => {
                    setLoading(false);
                    navigate('/admin/ordem')
                }).catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    const aprovarOrdem = (aprovar: boolean) => {
        setLoading(true)
        CNPApi.patch('/ordem/approve', {
            approved: aprovar,
            ordemId: id
        }).then(response => {
            setLoading(false)
            setAprovado(response.data.ordem)
        }).catch(() => {
            setLoading(false)
        })
    }

    const changeStatus = (status: string) => {
        setLoading(true);
        setAnchorElStatus(null)
        CNPApi.patch('/ordem/change-status', {
            status: status,
            ordemId: id
        })
            .then(response => {
                setLoading(false)
                setStatus(response.data.ordem.status)
            }).catch(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        CNPApi.get<{ ordem: Ordem }>(`/ordem/${id}`)
            .then(response => {
                setLoading(false)
                setOrdem(response.data.ordem)
                setStatus(response.data.ordem.status)
                setAprovado(response.data.ordem.approved)
            }).catch(() => {
                setLoading(false)
            })
    }, [id])

    return (
        <div className='ordem-detalhe'>
            {loading
                ? (<Loading />)
                : ordem && (<div>
                    <div className='header-detalhe'>
                        <div onClick={() => navigate(-1)} >
                            <ArrowBackOutlinedIcon />
                        </div>
                        <p>{ordem.nome}</p>
                    </div>

                    <div className='detalhe-corpo'>
                        <div className='aside'>
                            <div 
                                onClick={() => setOpenModal(true)}
                                className='imgLogo'
                                >
                                <Avatar
                                    sx={{ width: 200, height: 200 }}
                                    alt="logo" src={ordem.logoURL} />
                            </div>

                            <p style={{ marginTop: '7px' }}>Sigla: {ordem.sigla}</p>
                          
                            {/* <div style={{ color: ordem.approved ? 'rgba(124, 236, 54, 0.757)' : '#E12025', fontSize: '12pt', fontWeight: '500' }}>
                                {aprovado ? 'Aprovado' : 'Não Aprovado'}
                            </div> */}

                            <div style={{
                                background: getStatusBackgroundColor(status)
                            }}
                                className='estado' onClick={handleClickStatus}>
                                {status}
                                <span
                                    className={`icon-wrapper ${isIconClicked ? 'clicked' : ''}`}
                                    onClick={() => { setIsIconClicked(!isIconClicked); }}
                                >
                                    <ArrowRightOutlinedIcon className="front" />
                                    <ArrowDropDownOutlinedIcon className="back" />
                                </span>
                            </div>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'long-button',
                                }}
                                anchorEl={anchorElStatus}
                                open={openStatus}
                                onClose={handleCloseStatus}
                                slotProps={{
                                    paper: {
                                        style: {
                                            maxHeight: 48 * 4.5,
                                            width: '15ch',
                                        },
                                    },
                                }}
                            >
                                {['Activo', 'Inactivo', 'Análise', 'Demo'].map((item) => (
                                    <MenuItem
                                        key={item}
                                        style={{ margin: '5px', borderRadius: '5px' }}
                                        onClick={() => {
                                            setOpenStatus(true);
                                            setModalMessage(item);
                                        }}
                                        disableRipple
                                    >
                                        {item === 'Inactivo' ? 'Inactivar' :
                                            item === 'Activo' ? 'Activar' : item}
                                    </MenuItem>
                                ))}
                            </Menu>

                            <div
                                style={{ display: ordem.approved ? 'none' : 'flex' }}
                                className='estado'
                                onClick={() => { setOpenAprovar(true); setInfoTextAprove('Aprovar') }} >
                                <CheckIcon />
                                Aprovar
                            </div>
                            <div
                                className='estado' style={{ background: '#E12025' }} onClick={() => { setOpenAprovar(true); setInfoTextAprove('Apagar') }}>
                                <DeleteOutlineOutlinedIcon />
                                Apagar
                            </div>
                        </div>

                        <div className='corpo'>
                            <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                                <InformacaoGeral ordem={ordem} />
                                <Assinatura ordem={ordem} setOrdem={setOrdem} />
                            </div>
                        </div>
                    </div>

                    <Dialog
                        open={openModal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setOpenModal(false)}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <div style={{ alignItems: 'center', cursor: 'pointer' }} className='modalLogo'>
                            <p>Alterar Logotipo</p>
                            <div>
                                <div onClick={() => fileInput.current?.click()}>
                                    <p> Click para Carregar uma assinatura</p>
                                    <Avatar

                                        className='imgLogoModal'
                                        sx={{ width: 200, height: 200 }}
                                        alt="Remy Sharp"
                                        src={image || ordem.logoURL}
                                    />
                                </div>
                                <input ref={fileInput} type="file" name='logo_'
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setLogo(e.target.files[0]);
                                            setImage(URL.createObjectURL(e.target.files[0]))
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <DialogActions>
                                <Button style={{ color: '#E12025' }} onClick={() => setOpenModal(false)}>Cancelar</Button>
                                <Button onClick={() => changeLogo()} autoFocus>
                                    Alterar
                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>

                    <Dialog
                        open={openModalStatus}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <div className='modal-assinatura' style={{ padding: '10px 20px' }}>
                            <p style={{ textAlign: 'center', padding: '10px', fontWeight: '300' }}>Deseja realmente mudar o estado para  "{modalMessage}"? </p>
                            <DialogActions>
                                <Button style={{ color: '#E12025' }} onClick={() => setOpenStatus(false)}>Cancelar</Button>
                                <Button onClick={() => { setOpenStatus(false); changeStatus(modalMessage) }} autoFocus>
                                    Sim
                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>

                    <Dialog
                        open={openModalAprovar}
                        onClose={() => setOpenAprovar(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <div className='modal-assinatura' style={{ padding: '7px 30px' }}>
                            <p style={{ textAlign: 'center', padding: '5px 15px', fontWeight: '300' }}>Deseja <span style={{ fontWeight: '500' }}>{infoTextAprove}</span> esta Ordem?</p>
                            <DialogActions>
                                <Button onClick={() => setOpenAprovar(false)}>Não</Button>
                                <Button onClick={() => {
                                    setOpenAprovar(false);
                                    infoTextAprove == 'Aprovar' ?
                                        aprovarOrdem(true)
                                        : deleteOrdem()
                                }} autoFocus>
                                    Sim
                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>

                </div>
                )
            }
        </div>
    )
}

export default OrdemDetalhe
