import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading/loading'
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AnuncianteTratamento from './anuncianteTratamento';
import CNPApi from '../../../services/CNPApi';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#E12025',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

interface Anunciante {
    _id: string;
    nif: string;
    perfil: string;
    nome: string;
    tel: string;
    email: string;
}

const Anunciantes: React.FC = () => {
    const navigate = useNavigate();

    const [anunciantes, setAnunciantes] = useState<Anunciante[]>([])
    const [anunciante, setAnunciante] = useState<Anunciante | null>(null);
    const [nif, setNif] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const buscarAnunciante = () => {
        setLoading(true);
        CNPApi.get<{ anunciante: Anunciante }>(`/anunciante/nif/${nif}`)
            .then(response => {
                setLoading(false);
                setAnunciante(response.data.anunciante);
            }).catch(() => {
                setLoading(false);
                setShowError(true)
                setError('Erro ao buscar anunciante. NIF inexistente.');
            });
    };

    useEffect(() => {
        setLoading(true);
        CNPApi.get<{ anunciantes: Anunciante[] }>('/anunciantes')
            .then(res => {
                setLoading(false)
                setAnunciantes(res.data.anunciantes)
            }).catch(() => {
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowError(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [error]);

    return (
        <div>
            <div className={anunciante?.nif == nif ? '' : 'anunciantes'}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Paper
                        style={{ margin: '15px 0' }}
                        component="form"
                        sx={{ p: '1px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                    >
                        <InputBase
                            name='anuncinateNif_'
                            sx={{ ml: 1, flex: 1 }}
                            value={nif}
                            onChange={(e) => setNif(e.target.value)}
                            placeholder="buscar pelo NIF"
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                            onClick={buscarAnunciante}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </div>

                {loading
                    ? <Loading />
                    : <div>
                        {showError && <div className='erroMessange' style={{ color: 'red', width: '600px', margin: 'auto', padding: '10px' }}><p>{error}</p></div>}

                        {anunciante && anunciante.nif === nif ? (
                            <AnuncianteTratamento idBusca={anunciante._id} />
                        ) : (
                            <div className="tabelaAnunciates">
                                {anunciantes.length > 0 ? (
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 400 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>Perfil</StyledTableCell>
                                                    <StyledTableCell align="right">Nome</StyledTableCell>
                                                    <StyledTableCell align="right">NIF</StyledTableCell>
                                                    <StyledTableCell align="right">Contacto</StyledTableCell>
                                                    <StyledTableCell align="right">Email&nbsp;</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {anunciantes.map((anunciante) => (
                                                    <StyledTableRow key={anunciante._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/anunciante/tratamento/${anunciante._id}`)} className='tableBody'>
                                                        <StyledTableCell align="right">{anunciante.perfil}</StyledTableCell>
                                                        <StyledTableCell align="right">{anunciante.nome}</StyledTableCell>
                                                        <StyledTableCell align="right">{anunciante.nif}</StyledTableCell>
                                                        <StyledTableCell align="right">{anunciante.tel}</StyledTableCell>
                                                        <StyledTableCell align="right">{anunciante.email}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                ) : (
                                    !error && <p>Nenhum resultado encontrado. Tente buscar um NIF.</p>
                                )}
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default Anunciantes
