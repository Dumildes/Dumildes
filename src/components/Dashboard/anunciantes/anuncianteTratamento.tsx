import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../Loading/loading'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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

interface Anunciante {
    _id: string;
    nome: string;
    status: string;
    perfil: string;
    nif: string;
    email: string;
    tel: string;
}

interface Anuncio {
    _id: string;
    tipo: string;
    descricao: string;
    link: string;
    imagens: string;
    createdAt: string;
    pagamento: {
        status: string;
        ref: string;
        entidade: string;
        montante: number;
        emolumento?: {
            designacao: string;
        };
    };
}

interface AnuncianteTratamentoProps {
    idBusca?: string;
}

const AnuncianteTratamento: React.FC<AnuncianteTratamentoProps> = ({ idBusca }) => {
    const { id } = useParams<{ id: string }>();
    const id_ = id ? id : idBusca;

    const navigate = useNavigate();

    const [anunciante, setAnunciante] = useState<Anunciante | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isIconClicked, setIsIconClicked] = useState<boolean>(false);
    const [anchorElStatus, setAnchorElStatus] = useState<null | HTMLElement>(null);
    const openStatus = Boolean(anchorElStatus);


    const handleClickStatus = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorElStatus(event.currentTarget);
    };

    const handleCloseStatus = () => {
        setAnchorElStatus(null);
    };

    const changeStatus = (status: string) => {
        setLoading(true)
        setAnchorElStatus(null)
        CNPApi.patch('/anunciante/change-status', {
            status: status,
            id: id_,
        }).then(response => {
            setLoading(false)
            setAnunciante(response.data.anunciante)
        }).catch(() => {
            setLoading(false)
        })
    }

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [anuncianteResponse, anunciosResponse] = await Promise.all([
                    CNPApi.get<{ anunciante: Anunciante }>(`/anunciante/${id_}`),
                    CNPApi.get<{ anuncios: Anuncio[] }>(`/anuncios?anuncianteId=${id_}&perPage=20`)
                ]);
                setLoading(false)
                setAnunciante(anuncianteResponse.data.anunciante);
                setAnuncios(anunciosResponse.data.anuncios);
            } catch (error) {
                setLoading(false)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id_])

    return (
        <div>
            {loading ?
                <Loading />
                :
                < div className='anuncio-detalhe'>
                    <div className='header-detalhe' style={{ justifyContent: 'space-between' }}>
                        <div onClick={() => navigate(-1)} >
                            <ArrowBackOutlinedIcon />
                        </div>
                        <p style={{ marginLeft: '0', textTransform: 'capitalize' }}>{anunciante?.nome}</p>
                        <div
                            style={{
                                width: '85px',
                                background: anunciante?.status == 'Activo'
                                    ? 'rgba(124, 236, 54, 0.757)'
                                    : anunciante?.status == 'Inactivo' ? '#E32D2D'
                                        : anunciante?.status == 'Suspenso' ? '#00C2FE '
                                            : '#FBAF1B'
                            }}
                            className='estado' onClick={handleClickStatus}>
                            {anunciante?.status}
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
                                    {item === 'Inactivo' ? 'Inactivar' :
                                        item === 'Activo' ? 'Activar' : item}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <div>
                        <div className='corpo-anuciante'>
                            <div>
                                <div className="body-anuncio" style={{ width: '100%' }}>
                                    <p><span>Perfíl:</span>{anunciante?.perfil}</p>
                                    <p><span>NIF:</span>{anunciante?.nif}</p>
                                    <p><span>Email:</span>{anunciante?.email}</p>
                                    <p><span>Contacto:</span>{anunciante?.tel}</p>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        background: '#fff',
                                        borderRadius: '4px',
                                        textTransform: 'capitalize',
                                        marginTop: '5px',
                                        padding: '5px 7px',
                                        fontSize: '15px',
                                        alignItems: 'center'
                                    }}
                                    >
                                        <p>Anúncios</p>
                                        <p
                                            onClick={() => navigate(`/admin/anuncio/criar/${anunciante?._id}`)}
                                            className='create-anunc'
                                        >Criar Anúncio</p>
                                    </div>

                                    {loading ?
                                        <Loading />
                                        :
                                        anuncios.length != 0
                                            ? <div>
                                                {anuncios.map((anuncio) => (
                                                    <div className='corpo'>
                                                        <div className="body-anunciante-img">
                                                            <Card
                                                                key={anuncio._id}
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
                                                                <div style={{ height: '400px', textOverflow: 'ellipsis', overflow: 'auto' }}>
                                                                    <p className='descricao'><span>Descriçāo:</span>
                                                                        <span style={{ textAlign: 'justify', padding: '20px 10px', fontWeight: '200' }}> {anuncio.descricao}</span>
                                                                    </p>

                                                                </div>
                                                            </div>
                                                            <div className="body-anuncio">
                                                                <p><span>Tipo: </span>{anuncio.tipo}</p>
                                                                {anuncio.link && (
                                                                    <p><span>Link:</span> <a href={anuncio.link} style={{ textTransform: 'lowercase', color: '#00B0F0', cursor: 'pointer', textDecoration: 'none' }}>{anuncio.link}</a></p>
                                                                )}
                                                                <p><span>Designação:</span> {anuncio?.pagamento?.emolumento?.designacao}</p>
                                                                <p><span>Publicado:</span>{formatDateTime(anuncio.createdAt)}</p>
                                                            </div>
                                                            <div className="body-anuncio">
                                                                <div style={{ alignItems: 'center', marginTop: '7px' }}>
                                                                    <p><span>Pagamento:</span> <span className='estado-body' style={{ background: anuncio?.pagamento?.status == 'Pendente' ? '' : 'rgba(124, 236, 54, 0.757)' }}>{anuncio?.pagamento?.status == 'Pendente' ? anuncio?.pagamento?.status : 'Efecuado'}</span></p>
                                                                    <p><span>Referência:</span> {anuncio?.pagamento?.ref}</p>
                                                                    <p><span>Entidade:</span>{anuncio?.pagamento?.entidade}</p>
                                                                    <p><span>Montante:</span> {anuncio?.pagamento?.montante}, 00kz</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            : <p style={{ background: '#fff', borderRadius: '4px', textTransform: 'capitalize', marginTop: '5px', padding: '3px', textAlign: 'center' }}>Nenhuma Postagem</p>}
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
            }
        </div >
    )
}

export default AnuncianteTratamento