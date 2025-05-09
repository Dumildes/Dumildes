import React, { useEffect, ReactElement, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    IconButton,
    Typography,
    Divider,
    ListItemButton,
    ListItemText,
    Collapse,
    Avatar,
    Tooltip,
    MenuItem,
    ListItemIcon,
    Menu
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Apps as AppsIcon
} from '@mui/icons-material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import CachedIcon from '@mui/icons-material/Cached';
import './acoesBtn.css'
import { useAuth } from '../../../contexts/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Loading/loading';

const theme = createTheme();

const drawerWidth = 275;

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
    rootAcordiao: {
        width: '100%',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        position: 'relative',
        // height: '100vh'
        // zIndex: 1,
    },
    drawerPaper: {
        width: drawerWidth,
        background: '#0c0b1e',
        color: '#fff',

        // [theme.breakpoints.down('xs')]: {
        //     zIndex: 1
        // },

        '&::-webkit-scrollbar': {
            width: '3px'
        },
        ' &::-webkit-scrollbar-thumb': {
            backgroundColor: '#000',
            // borderRadius: '10px',
        },
        ' &::-webkit-scrollbar-track': {
            backgroundColor: '#fff'
        }
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        // padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
        // marginBottom: 40,

    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        background: '#ebebf4',
        paddingTop: 0,
        minHeight: '100vh',
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        paddingTop: 0,
        marginLeft: 0,
        background: '#ebebf4',
        minHeight: '100vh',
    },

    img: {
        maxHeight: 100,
        // width: 160,
        // margin: 10,
        position: 'absolute',
        top: 10,
        left: '30%'
    },

    icones: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 10,
    },

    titulo: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    hoverList: {
        transition: 'all .3s',
        '&:hover': {
            background: '#24274a',
        },
    },
    hoverListItem: {
        padding: 3,
        fontSize: 15,
        transition: 'all .3s',
        '&:hover': {
            backgroundColor: '#0E0E0E',
            borderRadius: 3,
        },
    },
    ondeEstou: {
        backgroundColor: '#0E0E0E',
        borderRadius: 3,
    },

    profile: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'right',
    },
    info: {
        margin: '0 10px',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    }
}));

interface User {
    dadosPessoais?: {
        nome?: string;
        fotoURL?: string;
    };
    tipo?: string;
    funcao?: string;
    _id?: string;
}

export default function TemplateAdmin({ element: component }: {
    element: ReactElement;
    [key: string]: any;
}) {
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
    const url = useLocation();
    useEffect(() => { document.title = "Gestor - CNP" }, []);

    const classes = useStyles();

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const navegate = useNavigate()

    const [openEstabelecimento, setOpenEstabelecimento] = React.useState(false);
    const [openAnuncios, setOpenAnuncios] = React.useState(false);
    const [openFinancas, setOpenFinancas] = React.useState(false);
    const [openSeguradoras, setSeguradoras] = React.useState(false);
    const [openGestao, setGestao] = React.useState(false);
    const [load, setLoad] = useState(false);
    const [openCadastarAdmin, setCadastarAdmin] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        setLoad(true);
        handleClose();

        await new Promise(resolve => setTimeout(resolve, 3000));
        auth.logOut();
        setLoad(false);
    };

    const handleDrawerOpen = () => {
        localStorage.setItem("configView", JSON.stringify(true));
        setOpen(true);
    };

    const handleDrawerClose = () => {
        localStorage.setItem("configView", JSON.stringify(false));
        setOpen(false);
    };

    const selectOpen = (event: string) => {
        setOpenEstabelecimento(event === 'estabelecimento' && !openEstabelecimento);
        setOpenFinancas(event === 'financas' && !openFinancas)
        setOpenAnuncios(event === 'anuncios' && !openAnuncios)
        setSeguradoras(event === 'seguradoras' && !openSeguradoras)
        setGestao(event === 'GestaoInformacao' && !openGestao)
        setCadastarAdmin(event === 'gestorAdmin' && !openCadastarAdmin)
    };

    if (load) return <Loading />;
    return (
        <>
            <ThemeProvider theme={theme}>
                {!user
                    ?
                    <div></div>
                    :
                    <div className={classes.root}>
                        <CssBaseline />
                        <AppBar
                            position="fixed"

                            className={clsx(classes.appBar, {
                                [classes.appBarShift]: open,
                            })}

                            style={{ background: '#E12025', color: '#fff' }}
                        >
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    className={clsx(classes.menuButton, open && classes.hide)}
                                >
                                    <MenuIcon />
                                </IconButton>

                                {/* <Typography variant="h5">
                                    <img src="/cnplogo.svg" alt="CNP" width={50} />
                                </Typography> */}

                                <div className={classes.titulo} >
                                    <Typography variant="h1" style={{ fontSize: 21, marginLeft: 15 }}>
                                        <strong> CENTRAL DE AÇÃO</strong>
                                    </Typography>
                                </div>

                                <div className={classes.icones}>
                                    <Tooltip title="Limpar cach">
                                        <IconButton onClick={() => window.location.reload()}>
                                            <CachedIcon style={{ color: '#fff' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Menu">
                                        <IconButton onClick={() => { navegate('/admin/ordem') }} >
                                            <AppsIcon style={{ color: '#fff' }} />
                                        </IconButton>
                                    </Tooltip>
                                </div>

                                <div className={classes.profile}>
                                    <div className={classes.info}>
                                        <p>{user.dadosPessoais!.nome}</p>
                                        <small>{user?.funcao}</small>
                                    </div>

                                    <div className=''>
                                        <Avatar src={user.dadosPessoais!.fotoURL} alt="" onClick={handleClick} style={{ cursor: 'pointer', width: 55, height: 55, margin: '4px' }} />
                                        {/* <UserAdmin /> */}
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMenu}
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
                                </div>
                            </Toolbar>
                        </AppBar>

                        <Drawer
                            className={classes.drawer}
                            variant="persistent"
                            anchor="left"
                            open={open}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            <Box className={classes.drawerHeader} style={{ alignItems:"center", background: '#262626', marginBottom: 0 }}>

                                <a href="https://cnp.ao/" target={'_blank'} rel="noreferrer" style={{ textDecoration: 'none', alignItems:"center" }} title='Visitar a plataforma CNP'>
                                    <img src="/iconesCNP/IconColor-CNP.svg" alt="CNP" width={90} className={classes.img} />
                                </a>

                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon style={{ color: '#fff' }} /> : <ChevronRightIcon style={{ color: '#fff' }} />}
                                </IconButton>
                            </Box>

                            <List
                                style={{ background: '#262626', color: '#fff' }}
                                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', height: '100vh' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                className='list-side'
                            >
                                <div className={`${classes.hoverListItem}`}>
                                    <ListItemButton onClick={() => { navegate('/admin/ordem') }}>
                                        <img src="/icones/Dashboard.svg" width={30} style={{ marginRight: 15 }} alt="" />
                                        Dashboard
                                    </ListItemButton>
                                </div>
                                <div className={`${classes.hoverListItem} ${url.pathname === '/admin/ordem' && classes.ondeEstou}`}>
                                    <ListItemButton onClick={() => { navegate('/admin/ordem') }}>
                                        <img src="/icones/Menu.svg" width={30} style={{ marginRight: 15 }} alt="" />
                                        Menu
                                    </ListItemButton>
                                </div>

                                <br />
                                <Divider style={{ background: '#0E0E0E' }} />
                                <br />

                                <div className={`${classes.hoverListItem} ${(url.pathname === '/admin/gestor-estabelecimentos-licenciados') && classes.ondeEstou}`}>
                                    <ListItemButton onClick={() => selectOpen('estabelecimento')}>
                                        {/* <img src="/ordem.svg" width={45} style={{ marginRight: 15 }} alt="" /> */}
                                        <ListItemText disableTypography primary="Ordens" />
                                        {openEstabelecimento ? <ExpandMore /> : <NavigateNext />}
                                    </ListItemButton>
                                </div>
                                <Collapse in={openEstabelecimento} timeout="auto" unmountOnExit>
                                    <List component="div" style={{ background: '#0E0E0E' }} >
                                        <ListItemButton onClick={() => navegate('/admin/ordem')}>
                                            Activar Ordem
                                        </ListItemButton>
                                        <ListItemButton onClick={() => navegate('/admin/ordem/registrar')}>
                                            Registrar Ordem
                                        </ListItemButton>
                                        <ListItemButton onClick={() => navegate('/admin/ordem/registrar/admin')}>
                                            Registrar Admin
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                <div className={`${classes.hoverListItem} ${(url.pathname === '/admin/gestor-estabelecimentos-licenciados') && classes.ondeEstou}`}>
                                    <ListItemButton onClick={() => selectOpen('anuncios')}>
                                        {/* <img src="/anuncio.svg" width={35} style={{ marginRight: 15 }} alt="" /> */}
                                        <ListItemText disableTypography primary="Anúncios" />
                                        {openAnuncios ? <ExpandMore /> : <NavigateNext />}
                                    </ListItemButton>
                                </div>
                                <Collapse in={openAnuncios} timeout="auto" unmountOnExit>
                                    <List component="div" style={{ background: '#0E0E0E' }} >
                                        <ListItemButton onClick={() => navegate('/admin/anuncios')}>
                                            Ver Anúncios
                                        </ListItemButton>
                                        <ListItemButton onClick={() => navegate('/admin/anunciantes')}>
                                            Anúnciantes
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                {/* <div className={`${classes.hoverListItem} ${(url.pathname === '/admin/gestor-estabelecimentos-licenciados') && classes.ondeEstou}`}>
                                    <ListItemButton onClick={() => selectOpen('seguradoras')} >
                                        <img src="/icones/Director_tecnico.svg" width={35} style={{ marginRight: 15 }} alt="" />
                                        <ListItemText disableTypography primary="Seguradoras" />
                                        {openSeguradoras ? <ExpandMore /> : <NavigateNext />}
                                    </ListItemButton>
                                </div> */}

                                <Collapse in={openSeguradoras} timeout="auto" unmountOnExit >
                                    <List component="div" style={{ background: '#0E0E0E' }} >
                                        <ListItemButton onClick={() => navegate('/admin/seguradoras')}>
                                            Ver Seguradoras
                                        </ListItemButton>
                                        <ListItemButton onClick={() => navegate('/admin/anuncio/criar')}>
                                            Registrar Seguradoras
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                <div className={`${classes.hoverListItem} ${(url.pathname === '/admin/gestor-estabelecimentos-licenciados') && classes.ondeEstou}`}>
                                    <ListItemButton onClick={() => selectOpen('GestaoInformacao')} >
                                        {/* <img src="/icones/Director_tecnico.svg" width={35} style={{ marginRight: 15 }} alt="" /> */}
                                        <ListItemText disableTypography primary="Gestão de Informaçōes" />
                                        {openGestao ? <ExpandMore /> : <NavigateNext />}
                                    </ListItemButton>
                                </div>

                                <Collapse in={openGestao} timeout="auto" unmountOnExit >
                                    <List component="div" style={{ background: '#0E0E0E' }} >
                                        <ListItemButton onClick={() => navegate('/admin/gestor-banner')}>
                                            Gestor de Banner
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                <div className={`${classes.hoverListItem} ${(url.pathname === '/admin/gestor-estabelecimentos-licenciados') && classes.ondeEstou}`}>
                                    <ListItemButton onClick={() => selectOpen('gestorAdmin')} >
                                        {/* <img src="/icones/Director_tecnico.svg" width={35} style={{ marginRight: 15 }} alt="" /> */}
                                        <ListItemText disableTypography primary="Gestão de Administrador" />
                                        {openCadastarAdmin ? <ExpandMore /> : <NavigateNext />}
                                    </ListItemButton>
                                </div>

                                <Collapse in={openCadastarAdmin} timeout="auto" unmountOnExit >
                                    <List component="div" style={{ background: '#0E0E0E' }} >
                                        <ListItemButton onClick={() => navegate('/admin/cadastrar-admin')}>
                                            Cadastrar Administrador
                                        </ListItemButton>
                                        <ListItemButton onClick={() => navegate('/admin/lista-de-administradores')}>
                                            Lista de Administradores
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                <ListItemButton onClick={() => navegate('/admin/provincias')} style={{ textDecoration: 'none', fontWeight: '390', fontSize: '12pt' }}>
                                    Províncias/Municípios
                                </ListItemButton>

                            </List>
                        </Drawer>

                        <main
                            className={clsx(classes.content, {
                                [classes.contentShift]: open,
                            })}
                        >
                            <div className={classes.drawerHeader} />
                            {component}

                        </main>
                    </div>
                }
            </ThemeProvider>
        </>
    );
}
