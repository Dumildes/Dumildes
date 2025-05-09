import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

interface ValidationErrors {
    email: string;
}

const ForgetSenha: React.FC = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [errorMessange, setErrorMessange] = useState("");
    const [showError, setShowError] = useState(false);

    const validateFields = (email: string) => {
        const errors: ValidationErrors = {
            email: 'Insira por favor o email'
        };
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            setErrorMessange(errors.email);
            setShowError(true);
            return false;
        } 
        
        if (!emailRegex.test(email)) {
            setErrorMessange('Email inválido');
            setShowError(true);
            return false;
        }
    
        return true;
    };

    useEffect(() => {
        setTimeout(() => {
            setShowError(false);
        }, 4000);
    }, [errorMessange])

    return (
        <div>
            <div className='forgetNav' onClick={() => navigate(-1)}>
                <ArrowBackOutlinedIcon />
            </div>
            <Box
                className='forgetBox'
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <p className='forgetTxt'>Esqueceu a Senha?</p>
                <p style={{}} className='paragrafos'>Por favor, insira seu Email para redefinir a senha</p>

                {showError ? <div className='erroMessange'> <p >{errorMessange}</p> </div> : <p></p>}

                <TextField className='loginField' id="email" label='Email *' name='email' variant="outlined" onChange={(e) => setEmail(e.target.value)} />
                <Button variant="contained" className='loginBtn' onClick={() => validateFields(email)}> Redefinir Senha</Button>
            </Box>
        </div>
    )
}

export default ForgetSenha
