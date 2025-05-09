/// <reference no-default-lib="true"/>
/* eslint-disable */
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import LoadingShort from '../../../load/loadingShort';
import { useAuth } from '../../../../contexts/AuthProvider';
import CNPApi from '../../../../services/CNPApi';

interface User {
    dadosPessoais?: {
        nome?: string;
        fotoURL?: string;
    };
    tipo?: string;
    funcao?: string;
    _id?: string;
}

const DeleteBanner = (props) => {
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
    const [open, setOpen] = useState(false);

    const HandleDeleteNoticia = () => {
        setOpen(true)
        props.setMessageSuccess('')
        props.setMessageError('')

        CNPApi.delete('/carousel/delete', { data: { 'id': props.bannerId, 'userId': user._id } })

            .then(response => {
                setOpen(false)
                props.setMessageSuccess(response.data.message)
                props.setForceUpdate(response)

            }).catch(err => {
                setOpen(false)
                props.setMessageError(err.response.data.message)
            })
        console.log('bannerId:', props.bannerId);
        console.log('userId:', user._id);

    }

    return (<IconButton title='Apagar' onClick={HandleDeleteNoticia} color="error">{open ? <LoadingShort text='' /> : <DeleteIcon />}</IconButton>);
}

export default DeleteBanner;
