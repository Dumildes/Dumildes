import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogActions } from '@mui/material';
import { useParams } from 'react-router-dom';
import verificado from '../../../assets/verificado.png'
import aviso from '../../../assets/aviso.png'
import CNPApi from '../../../services/CNPApi';

interface Municipio {
    designacao: string;
}

const AddMunicipio: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [municipio, setMunicipio] = useState<Municipio>({ designacao: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState('')

    const validateFields = () => {
        if (!municipio.designacao.trim()) {
            setErrorMessage('Preencha a designação do Município');
            setShowError(true);
            return false;
        }
        return true;
    };

    const handleRegistrarMunicipio = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const response = await CNPApi.put('/municipios/create', {
                designacao: municipio.designacao,
                provinciaId: id
            });
            setMessageSuccess(response.data.msg);
        } catch (error) {
            setErrorMessage('Ocorreu um erro ao adicionar o município. Tente novamente.');
            setShowError(true);
        } finally {
            setLoading(false);
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

    return (
        <div>
            <div className='registrar-home addProvincia'>
            <h3 style={{textTransform:'uppercase', textAlign:'center', margin:'10px', marginBottom:'20px', fontWeight:'400'}}>Adicionar Município</h3>
                {showError && <div className="erroMessange"><p>{errorMessage}</p></div>}
                <Box
                    component="form"
                    style={{margin: '5px'}}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="municipio"
                        label="Município *"
                        onChange={(e) => setMunicipio({ ...municipio, designacao: e.target.value })}
                        value={municipio.designacao}
                        variant="outlined"
                        className='txtField'
                    />

                    <div className='btnSend'>
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={handleRegistrarMunicipio}
                        >
                            {loading ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                    </div>
                </Box>
            </div>
            <Dialog
                open={modalSuccess}
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
                        <Button onClick={() => { setModalSuccess(false); 
                         }}>Fechar</Button>
                        : <Button onClick={() => { setModalSuccess(false) }} style={{ color: '#E12025' }}>Tentar Novamente</Button>}
                </DialogActions>
            </Dialog>
            <Dialog
                open={modalSuccess}
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
                        <Button onClick={() => { setModalSuccess(false); 
                         }}>Fechar</Button>
                        : <Button onClick={() => { setModalSuccess(false) }} style={{ color: '#E12025' }}>Tentar Novamente</Button>}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddMunicipio;