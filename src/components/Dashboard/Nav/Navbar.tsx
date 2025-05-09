import React from 'react'
import './navbar.css'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { useAuth } from '../../../contexts/AuthProvider';

interface NavbarProps {
    titulo: string;
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

const Navbar: React.FC<NavbarProps> = () => {
    const auth = useAuth();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        auth.logOut();
    };

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
    
    return (
        <div className='navbar'>

            <p className='titulo'>central de açōes</p>
            <Avatar alt={user.dadosPessoais?.nome || "User"}
                src={user.dadosPessoais?.fotoURL}
                onClick={handleClick}
                sx={{ width: 56, height: 56 }}
                className='perfil-foto'
            />
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem style={{ cursor: 'default' }}>
                    <p>{user.dadosPessoais?.nome}</p>
                </MenuItem>

                <MenuItem style={{ cursor: 'default' }}>
                    <p>{user.tipo}</p>
                </MenuItem>
                <MenuItem style={{ cursor: 'default' }}>
                    <p>{user.funcao}</p>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <p className='logout'>Logout</p>
                </MenuItem>
            </Menu>
        </div>
    )
}

export default Navbar
