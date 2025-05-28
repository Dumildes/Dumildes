import { useState, useEffect } from 'react';
import MessageError from '../../messages/messageError';
import { useParams } from 'react-router-dom';
import apiOfa from '../../services/apiOfa';

export default function ConsultorPorQrCode(props) {
    const { id } = useParams()
    const [messageError, setMessageError] = useState('')
    // const [url, setURL] = useState('')

    useEffect(() => {

        if (!id) {
            setMessageError('')
            props.setPesquisa('')
            // props.setPesquisaError('')
            props.setLoad(true)

            apiOfa.get(`membro/${id}`)
                .then(response => {
                     console.log(response)
                    props.setPesquisa([response.data.membro]);
                    props.setLoad(false)
                    props.setIsOpen(true)
                    props.setItemSelected(true)
                }).catch(error => {
                    // console.log(error)
                    if (error.message === "Network Error") {
                        setMessageError(error.message)
                    }
                    props.setLoad(false)
                    props.setPesquisa('');
                    // props.setPesquisaError(error.response.data.message);
                })
        }

    }, [id])

    // return (messageError && <MessageError message={messageError} />);
}