import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogActions } from '@mui/material';
import verificado from '../../../assets/verificado.png';
import aviso from '../../../assets/aviso.png';
import CNPApi from '../../../services/CNPApi';
import { useAuth } from '../../../contexts/AuthProvider';

interface Provincia {
    designacao: string;
    abreviatura: string;
}

interface User {
    dadosPessoais?: {
        nome?: string;
        fotoURL?: string;
    };
    tipo?: string;
    funcao?: string;
    _id?: string;
}

const AddProvincia: React.FC = () => {
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

    const [provincia, setProvincia] = useState<Provincia>({ designacao: '', abreviatura: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [messageSuccess, setMessageSuccess] = useState<string>('');

    const handleChangeProvincia = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProvincia(prev => ({ ...prev, [name]: value }));
    }; 

    const validateFields = () => {
        if (!provincia.designacao.trim()) {
            setErrorMessage('Preencha a designação da Província');
            setShowError(true);
            return false;
        }
       
        return true;
    };

    const handleRegistrarProvincia = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const response = await CNPApi.post('/provincias/create', {
                designacao: provincia.designacao,
                abreviatura: provincia.abreviatura,
                userId: user._id
            });
            setMessageSuccess(response.data.msg);
            setModalSuccess(true);
            console.log(response.data.msg)
        } catch (error) {
            setMessageSuccess('Erro');
            setModalSuccess(true);
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
                <h3 style={{textTransform:'uppercase', textAlign:'center', margin:'10px', marginBottom:'20px', fontWeight:'400'}}>Adicionar Província</h3>
                {showError && <div className="erroMessange"><p>{errorMessage}</p></div>}
                <Box
                    component="form"
                    style={{margin: '5px'}}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                    style={{marginBottom:'10px'}}
                        id="designacao"
                        name="designacao"
                        label="Província *"
                        value={provincia.designacao}
                        onChange={handleChangeProvincia}
                        variant="outlined"
                        className='txtField'
                    />
                    <TextField
                        id="abreviatura"
                        name="abreviatura"
                        label="Abreviatura"
                        value={provincia.abreviatura}
                        onChange={handleChangeProvincia}
                        variant="outlined"
                        className='txtField'
                    />

                    <div className='btnSend'>
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={handleRegistrarProvincia}
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
                    <img src={messageSuccess === 'Cadastrado com sucesso' ? verificado : aviso} alt="" height={100} width={100} />
                </div>
                <p style={{ textAlign: 'center', fontWeight: '350' }}>
                    {messageSuccess === 'Cadastrado com sucesso' 
                        ? 'Cadastro realizado com sucesso' 
                        : 'Alguma coisa deu errado, Tente Novamente!'}
                </p>
                <DialogActions>
                    <Button onClick={() => {
                        setModalSuccess(false);
                        if (messageSuccess === 'Cadastrado com sucesso') {
                            setProvincia({ designacao: '', abreviatura: '' });
                        }
                    }}>
                        {messageSuccess === 'Cadastrado com sucesso' ? 'Fechar' : 'Tentar Novamente'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddProvincia;