import React, { useState } from 'react'
import './login.css'
import { TextField, Button } from '@mui/material';
import cnpLogo from '../../../assets/cnplogo.svg'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { useAuth } from '../../../contexts/AuthProvider';
import toast from 'react-hot-toast';

const commonStyles = {
    '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 8px) scale(1)',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
    },
};

interface UserField {
    email: string;
    senha: string;
}

const Login = () => {
    const auth = useAuth();

    const [userField, setUserField] = useState<UserField>({
        email: '',
        senha: '',
    })

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleChange = (event: any) => {
        setUserField({ ...userField, [event.target.name]: event.target.value })
    }

    const validateFields = (fields: UserField): boolean => {
        const errors: Record<keyof UserField, string> = {
            email: userField?.email ==='' ? toast.error('Insira por favor o email'):'',
            senha: userField?.senha ==='' ? toast.error('Preencha a senha') : ''
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const [field] of Object.entries(errors)) {
            if (!fields[field as keyof UserField]) {
                return false;
            }
        }

        if (!emailRegex.test(fields.email)) {
            toast.error('Email inválido');
            return false;
        }
        handleLogin()
        return true;
    };

    const handleLogin = () => {
        auth.loginAction(userField.email, userField.senha);
    }

    if(auth.showError){toast.error(auth.errorMessage);}

    return (
        <div className='flex flex-col justify-between min-h-screen max-w-screen pb-10 md:pb-20 bg-white text-gray-700'>
            <div className='loginBox'>
                <div className='loginAside'>
                    <div style={{}} className='logo'>
                        <img src={cnpLogo} alt="logo" />
                    </div>

                    <div className='boxLogin' >
                        <p className='login'>Iniciar Secção</p>

                        <TextField
                            className='loginField'
                            type='email'
                            size="small"
                            id="email"
                            label='Email *'
                            name='email'
                            variant="outlined"
                            onChange={handleChange}
                            value={userField.email}
                        />

                        <FormControl variant="outlined" className='loginField' sx={commonStyles}>
                            <InputLabel htmlFor="outlined-adornment-password">Senha *</InputLabel>
                            <OutlinedInput
                                id="senha"
                                name='senha'
                                size="small"
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                value={userField.senha}
                                endAdornment={
                                    <InputAdornment position="end" style={{ paddingRight: '10px' }}>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Senha *"
                            />
                        </FormControl>
                        <Button variant="contained" disabled={!userField.email || auth.load} onClick={() => validateFields(userField)}
                            style={{ background: '#E12025' }}
                            className='loginBtn'>
                            {auth.load ? 'Logando...' : 'Entrar'}
                        </Button>
                        {/* <p onClick={() => navigate('/redefinir/senha')} style={{ cursor: 'pointer', color: '#E12025', textDecoration: 'underline' }} className='paragrafos'>Esqueceu a senha?</p> */}

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Login
