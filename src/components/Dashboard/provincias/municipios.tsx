import { useState, useEffect } from 'react'
import './provincias.css'
import { useParams } from 'react-router-dom';
import Loading from '../Loading/loading';
import { Button, Dialog, DialogActions, Box, TextField } from '@mui/material';
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


interface Municipio {
    _id: string;
    designacao: string;
    capital: string;
    numBairros: string;
}

interface Provincia {
    designacao: string;
}

interface ApiResponse {
    municipios: Municipio[];
    provincia: Provincia;
}

const Municipios = () => {
    const { id } = useParams();

    const [provincia, setProvincia] = useState<Provincia | null>(null);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [municipioAdd, setMunicipioAdd] = useState<Municipio>({
        _id: '',
        designacao: '',
        capital: '',
        numBairros: ''
    });
    const [load, setLoad] = useState<boolean>(true)
    const [modalMunicipio, setModalMunicipio] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const validateFields = () => {
        if (!municipioAdd.designacao.trim()) {
            setErrorMessage('Preencha a designação do Município');
            setShowError(true);
            return false;
        }
        return true;
    };

    const handleRegistrarMunicipio = async () => {
        if (!validateFields()) return;
        setLoad(true);
        try {
            await CNPApi.post('/municipios/create', {
                designacao: municipioAdd.designacao,
                provinciaId: id
            });

        } catch (error) {
            setErrorMessage('Ocorreu um erro ao adicionar o município. Tente novamente.');
            setShowError(true);
        } finally {
            setMunicipioAdd({
                _id: '',
                designacao: '',
                capital: '',
                numBairros: ''
            })
            setLoad(false);
        }
    };

    const handleDelete = (e: React.MouseEvent<HTMLTableCellElement>, _id: string) => {
        setLoad(true);
        e.stopPropagation();
        deleteMunicipio(_id);
    };

    const deleteMunicipio = (_id: string) => {
        if (_id) {
            CNPApi.delete(`/municipio/delete/${_id}`)
                .then(() => {
                    setLoad(false);
                }).catch(() => {
                    setLoad(false);
                });
        } else {
            setLoad(false);
        }
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    useEffect(() => {
        CNPApi.get<ApiResponse>(`/municipios-by-provincia/${id}`)
            .then((response) => {
                setMunicipios(response.data.municipios)
                setProvincia(response.data.provincia)
                setLoad(false)
            })
            .catch(() => {
                setLoad(false);
            })
    }, [load])

    return (
        <div>
            <div className='provincia'>
                {load ? <Loading />
                    :
                    <div>  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '10px' }}>
                        <p>Provincia de {provincia?.designacao}</p>
                        <Button variant="outlined" onClick={() => setModalMunicipio(true)}
                            style={{
                                borderColor: '#E12025',
                                color: '#E12025'
                            }}
                        >Adicionar Município</Button>
                    </div>
                        <div className='provBody'>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 400 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Municípios</StyledTableCell>
                                            <StyledTableCell align="right">Capital</StyledTableCell>
                                            <StyledTableCell align="right">Nº Municípios</StyledTableCell>
                                            <StyledTableCell>Ações</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            municipios.length > 0 ? (
                                                municipios.map((municipio) => (
                                                    <StyledTableRow key={municipio._id} className='tbProv' >
                                                        <StyledTableCell>{municipio.designacao}</StyledTableCell>
                                                        <StyledTableCell align="right">{municipio.capital?.length > 0 ? municipio.capital : 'Não disponivel'}</StyledTableCell>
                                                        <StyledTableCell align="right">{municipio.numBairros?.length > 0 ? municipio.numBairros : 'Não disponivel'}</StyledTableCell>
                                                        <StyledTableCell align="right" onClick={(e) => handleDelete(e, municipio._id)}
                                                            style={{ cursor: 'pointer', color: '#E12025', textAlign: 'right' }}>
                                                            <MdOutlineDelete size={20} />
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            ) : (
                                                <p style={{
                                                    display: 'flex',
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                    padding: '15px'
                                                }}>Nenhum município encontrado.</p>
                                            )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                }
            </div>

            <Dialog
                open={modalMunicipio}
                className='modal-assinatura'
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div>
                    <h3 style={{ textTransform: 'uppercase', textAlign: 'center', margin: '10px', marginBottom: '5px', fontWeight: '400' }}>Adicionar Município</h3>
                    {showError && <div className="erroMessange"><p>{errorMessage}</p></div>}
                    <Box
                        component="form"
                        className='municipio-modal'
                        style={{ margin: '5px' }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            style={{ width: "100%" }}
                            id="municipio"
                            label="Município *"
                            onChange={(e) => setMunicipioAdd({ ...municipioAdd, designacao: e.target.value })}
                            value={municipioAdd.designacao}
                            variant="outlined"
                            className='txtField'
                        />
                    </Box>
                </div>

                <DialogActions>
                    <Button onClick={() => setModalMunicipio(false)}>Fechar</Button>
                    <Button
                        variant="contained"
                        disabled={load}
                        onClick={handleRegistrarMunicipio}
                    >
                        {load ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Municipios

