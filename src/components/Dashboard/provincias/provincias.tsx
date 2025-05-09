import { useState, useEffect } from 'react'
import './provincias.css'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/loading';
import CNPApi from '../../../services/CNPApi';
import { MdOutlineDelete } from "react-icons/md";
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


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
    '&:hover': {
        backgroundColor: '#ccc',
        cursor: 'pointer',
    },
}));

interface Provincia {
    _id: string;
    designacao: string;
    abreviatura: string;
    numMunicipio: string;
    capital: string;
}

const Provincias = () => {
    const navigate = useNavigate()

    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [load, setLoad] = useState<boolean>(false)
    const [showError, setShowError] = useState<boolean>(false);

    const handleDelete = (e: React.MouseEvent<HTMLTableCellElement>) => {
        e.stopPropagation();
        //delete
    };

    useEffect(() => {
        setLoad(true)
        CNPApi.get<{ provincias: Provincia[] }>('provincias')
            .then((response) => {
                setLoad(false)
                setProvincias(response.data.provincias)
            })
            .catch(() => setLoad(false))
    }, [])

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <div>
            <div className='provincia'>
                {load ? <Loading />
                    : <div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '10px' }}>
                            <p>Provincias de Angola</p>
                            <Button variant="outlined" onClick={() => navigate('/admin/create/provincia')}
                                style={{
                                    borderColor: '#E12025',
                                    color: '#E12025'
                                }}>Adicionar Provincia</Button>
                        </div>
                        <div className='provBody'>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 400 }}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Províncias</StyledTableCell>
                                            <StyledTableCell align="right">Abreviatura</StyledTableCell>
                                            <StyledTableCell align="right">Capital</StyledTableCell>
                                            <StyledTableCell align="right">Nº Municípios</StyledTableCell>
                                            <StyledTableCell>Ações</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {provincias.map((provincia) => (
                                            <StyledTableRow key={provincia._id} onClick={() => navigate(`/admin/provincia/municipios/${provincia._id}`)}>
                                                <StyledTableCell>{provincia.designacao}</StyledTableCell>
                                                <StyledTableCell align="right">{provincia.abreviatura?.length > 0 ? provincia.abreviatura : 'Não disponível'}</StyledTableCell>
                                                <StyledTableCell align="right">{provincia.capital?.length > 0 ? provincia.capital : 'Não disponivel'}</StyledTableCell>
                                                <StyledTableCell align="right">{provincia.numMunicipio?.length > 0 ? provincia.numMunicipio : 'Não disponivel'}</StyledTableCell>
                                                <StyledTableCell align="right" onClick={handleDelete}
                                                    style={{ cursor: 'pointer', color: '#E12025', textAlign: 'right' }}>
                                                    <MdOutlineDelete size={20} />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>}

            </div>
        </div>
    )
}

export default Provincias

