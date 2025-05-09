import React, { useState, useEffect, MouseEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../Loading/loading'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import './anuncios.css'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import CNPApi from '../../../services/CNPApi';
import { format, formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'

interface Anuncio {
    _id: string;
    tipo: string;
    imagens: string[];
    status: string;
    titulo: string;
    descricao: string;
    link?: string;
    createdAt: string;
    pagamento?: {
        status: string;
        ref: string;
        entidade: string;
        montante: number;
        emolumento?: {
            designacao: string;
        };
    };
    anunciante?: {
        nome: string;
        nif: string;
        email: string;
        tel: string;
    };
}

const TratamentoAnuncio: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    const navigate = useNavigate();

    const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
    const [status, setStatus] = useState<string>('')
    const [openModal, setOpenModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [loading, setLoading] = useState(false)
    const [anchorElStatus, setAnchorElStatus] = useState<null | HTMLElement>(null);

    const openStatus = Boolean(anchorElStatus);

    const handleClickStatus = (event: MouseEvent<HTMLElement>) => {
        setAnchorElStatus(event.currentTarget);
    };

    const handleCloseStatus = () => {
        setAnchorElStatus(null);
    };

    const changeStatus = (newstatus: string) => {
        setLoading(true)
        setAnchorElStatus(null)
        CNPApi.patch('/anuncio/change-status', { status: newstatus, id })
            .then(response => {
                setLoading(false)
                setStatus(response.data.anuncio.status)
                setAnuncio(response.data.anuncio);
            }).catch(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        CNPApi.get(`/anuncio/${id}`)
            .then(response => {
                setLoading(false)
                setAnuncio(response.data.anuncio)
                setStatus(response.data.anuncio.status);
            }).catch(() => {
                setLoading(false)
            })
    }, [id])

    const getStatusBackgroundColor = (status: string) => {
        switch (status) {
            case 'Activo': return 'rgba(124, 236, 54, 0.757)';
            case 'Inactivo': return '#E32D2D';
            case 'Suspenso': return '#00C2FE';
            default: return '#FBAF1B';
        }
    };

    const formatDateTime = (date: string) => {
        const dateObj = new Date(date)

        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000

        const fullFormat = format(dateObj, "dd/MM/yyyy", {
            locale: pt,
        })

        const timeDistance = formatDistanceToNow(dateObj, {
            locale: pt,
            addSuffix: true,
        })

        if (Date.now() - dateObj.getTime() > sevenDaysInMs) {
            return fullFormat
        }

        return timeDistance.replace("aproximadamente ", "")
    }

    if (loading) return <Loading />;
    if (!anuncio) return <div>Anúncio não encontrado</div>;

    return (
        <div className='anuncio-detalhe'>
            <div className='header-detalhe' style={{ justifyContent: 'space-between' }}>
                <div onClick={() => navigate(-1)} >
                    <ArrowBackOutlinedIcon />
                </div>

                <p style={{ marginLeft: '0', textTransform: 'capitalize' }}>{anuncio.titulo}</p>

                <div style={{
                    width: '88px',
                    background: getStatusBackgroundColor(status)
                }}
                    className='estado' onClick={handleClickStatus}> {status}
                    <span
                        style={{ margin: '5px' }}
                        className={`icon-wrapper ${isIconClicked ? 'clicked' : ''}`}
                        onClick={() => {
                            setIsIconClicked(!isIconClicked);
                        }}
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
                    {['Inactivo', 'Análise', 'Suspenso'].map((item) => (
                        <MenuItem
                            key={item}
                            style={{ margin: '5px', borderRadius: '5px' }}
                            onClick={() => {
                                setOpenModal(true);
                                setModalMessage(item);
                            }}
                            disableRipple
                        >
                            {item === 'Inactivo' ? 'Inactivar' : item}
                        </MenuItem>
                    ))}
                </Menu>
            </div>

            <div>
                <div className='corpo'>
                    <div className="body-anuncio-img">
                        <Card
                            className='card-img-anuncio'
                            sx={{ height: 600 }}>
                            <CardMedia
                                sx={{ margin: 'auto' }}
                                title="green iguana"
                                image={`${anuncio.imagens}`}
                                component="img"
                            />
                        </Card>
                    </div>
                    <div className='body-anuncio-aside'>
                        <div className="body-anuncio">
                            <div style={{ height: '255px', textOverflow: 'ellipsis', overflow: 'auto' }}>
                                <p className='descricao'><span>Descriçāo:</span>
                                    <span style={{ textAlign: 'justify', padding: '20px 10px', fontWeight: '200' }}> {anuncio.descricao}</span>
                                </p>

                            </div>
                        </div>
                        <div className="body-anuncio">
                            <p>Dados do Anúncio</p>
                            <Divider />
                            <p><span>Tipo: </span>{anuncio.tipo}</p>
                            {anuncio.link && (
                                <p><span>Link:</span> <a href={anuncio.link} style={{ textTransform: 'lowercase', color: '#00B0F0', cursor: 'pointer', textDecoration: 'none' }}>{anuncio.link}</a></p>
                            )}
                            <p><span>Designação:</span> {anuncio?.pagamento?.emolumento?.designacao}</p>
                            <p><span>Publicado:</span>{formatDateTime(anuncio.createdAt)}</p>
                        </div>
                        <div className="body-anuncio">
                            <p>Dados do pagamento</p>
                            <Divider />
                            <div style={{ alignItems: 'center', marginTop: '7px' }}>
                                <p><span>Pagamento:</span> <span className='estado-body' style={{ background: anuncio?.pagamento?.status == 'Pendente' ? '' : 'rgba(124, 236, 54, 0.757)' }}>{anuncio?.pagamento?.status == 'Pendente' ? anuncio?.pagamento?.status : 'Efecuado'}</span></p>
                                <p><span>Referência:</span> {anuncio?.pagamento?.ref}</p>
                                <p><span>Entidade:</span>{anuncio?.pagamento?.entidade}</p>
                                <p><span>Montante:</span> {anuncio?.pagamento?.montante}, 00kz</p>
                            </div>
                        </div>
                        <div className="body-anuncio">
                            <p>Anunciante</p>
                            <Divider />
                            <p><span>Nome:</span> {anuncio?.anunciante?.nome}</p>
                            <p><span>NIF:</span> {anuncio?.anunciante?.nif}</p>
                            <p><span>Email:</span> {anuncio?.anunciante?.email}</p>
                            <p><span>tel. :</span> {anuncio?.anunciante?.tel}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={openModal}
                className='modal-assinatura'
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <p style={{ textAlign: 'center', padding: '20px 10px', fontWeight: '300' }}>Deseja realmente mudar o estado para  "{modalMessage}"? </p>
                <DialogActions>
                    <Button style={{ color: '#E12025' }} onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button onClick={() => { setOpenModal(false), changeStatus(modalMessage) }} autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default TratamentoAnuncio
