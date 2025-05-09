import React, { useState, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Ordem {
    _id: string;
    prioridade: string;
    profissao: string;
    email: string;
    tel: string;
    descricao: string;
    local: string;
    municipio: string;
    provincia: string;
    URL: string;
    serverURL: string;
}

interface Props {
    ordem: Ordem;
}

const InformacaoGeral: React.FC<Props> = ({ ordem }) => {
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <div className="body-detalhe">
                <div className="body-header">
                    <p className='descricao'>Descrição: <span>{ordem.descricao}</span></p>
                </div>
            </div>
            <div className='info-contact'>
                <div className="body-detalhe">
                    <div className="body-header">
                        <p className='prioridade'><span>Prioridade: </span>{ordem.prioridade}</p>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>

                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                paper: {
                                    style: {
                                        maxHeight: 48 * 4.5,
                                        width: '15ch',
                                    },
                                },
                            }}
                        >
                            <MenuItem onClick={() => {
                                handleClose();
                                navigate(`/admin/ordem/editar/${ordem._id}`)
                            }} disableRipple>
                                <EditIcon />
                                Editar Ordem
                            </MenuItem>
                        </Menu>
                    </div>
                    <p className='prioridade'><span>Profissão: </span>{ordem.profissao}</p>
                    <p className="prioridade"><span>Email: </span>{ordem.email}</p>
                    <p className='prioridade'><span>Tel: </span>{ordem.tel}</p>
                </div>

                <div className="body-detalhe dados-endereco">
                    <p><span>Endereço: </span>{ordem.local}, {ordem.municipio}-{ordem.provincia}</p>
                    <p className='url'><span>Endereço do site: </span><a rel="noopener noreferrer" target='_blank' href={ordem.URL}>{ordem.URL}</a></p>
                    <p className='url'><span>Endereço do servidor: </span><a rel="noopener noreferrer" target='_blank' href={ordem.serverURL}>{ordem.serverURL}</a></p>
                </div>
            </div>

        </div>
    )
}

export default InformacaoGeral
