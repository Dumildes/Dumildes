/// <reference no-default-lib="true"/>
/* eslint-disable */
import { useState } from "react";
import { Avatar, Box, Button, Card, Dialog } from "@mui/material";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import apiOfa from "../../../../services/apiOfa";
import MessageSuccess from "../../../../messages/messageSuccess";
import MessageError from "../../../../messages/messageError";

function SimpleDialog(props) {
    const { onClose, open, submitEdit, setEdit, edit, Foto, openLoad } = props;

    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <Card px={1} style={{ fontFamily: 'Work Sans', lineHeight: 1.5, padding: 10 }} align="center" variant="body1">

                <Box sx={{
                      marginTop: 10,
                      marginBottom: 10,
                      border: '1px dashed #3e3d3f',
                }}>
                    <div>
                        {edit ?
                            <Avatar style={{ width: 300, height: 190 }} className='rounded-md transition-all duration-1000 hover:opacity-70' variant="square" src={URL.createObjectURL(edit)} title="Clique para carregar uma imagem" />
                            :
                            <Avatar style={{ width: 300, height: 190 }} className='rounded-md transition-all duration-1000 hover:opacity-70' variant="square" src={Foto} title="Clique para carregar uma imagem" />
                        }
                    </div>
                    <input accept="image/png, image/jpg, image/jpeg" type="file" name="foto" id="foto" style={{ display: 'none' }} onChange={(e) => setEdit(e.target.files[0])} />
                    {
                        openLoad &&
                        <Loading text={'Salvando'} />
                    }
                </Box>
                {
                    edit ?
                        <Box m={2} textAlign={'center'} style={{ display: 'flex' }}>
                            <Button style={{ marginRight: 8 }} size="small" color="error" onClick={() => setEdit('')}>cancelar </Button>
                            <Button style={{ width: 80 }} size="small" color="success" onClick={submitEdit}>Salvar </Button>
                        </Box>
                        :
                        <label htmlFor="foto" style={{ cursor: 'pointer', textAlign: 'center' }}>
                            Alterar imagem
                        </label>
                }
            </Card>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};


export default function ImageBannerEdit({ foto, noticiaId, setEditarNoticia }) {
    const [Foto, setFoto] = useState(foto)
    const [edit, setEdit] = useState('')
    const [openLoad, setOpenLoad] = useState(false)
    const [messageSuccess, setMessageSuccess] = useState('')
    const [messageError, setMessageError] = useState('')
    const [open, setOpen] = useState(false);
    const user = useSelector(state => state.account.user);

    const handleClose = () => {
        setOpen(false);
        setEdit('')
    };

    const submitEdit = async () => {
        setOpenLoad(true)
        setMessageSuccess('')
        setMessageError('')

        const formData = new FormData();
        formData.append('imagem', edit);
        formData.append('noticiaId', noticiaId);
        formData.append('userId', user._id);

        await apiOfa.patch('/carousel/change-imagem', formData)
            .then(res => {
                setOpenLoad(false)
                setOpen(false)
                setFoto(res.data.noticia.imagem)
                setMessageSuccess('Imagem editada com sucesso.')
                setTimeout(() => {
                    setEditarNoticia(false)
                }, 3000);
                // console.log(res)

            }).catch(err => {
                // console.log(err)
                setOpenLoad(false)
                setMessageError('Não foi possivel realizar esta ação.')
            })
    }

    return (
        <>
            <SimpleDialog
                Foto={Foto}
                open={open}
                openLoad={openLoad}
                onClose={handleClose}
                submitEdit={submitEdit}
                edit={edit}
                setEdit={setEdit}
            />

            {messageSuccess && <MessageSuccess message={messageSuccess} />}
            {messageError && <MessageError message={messageError} />}

            <Box onClick={() => setOpen(true)} className={classes.avatarContainer}>
                {edit ?
                    <Avatar style={{ width: '100%', height: '100%', maxHeight:'60vh' }} className='rounded-md transition-all duration-1000 hover:opacity-70' variant="square" src={URL.createObjectURL(edit)} title="Clique para carregar uma imagem" />
                    :
                    <Avatar style={{ width: '100%', height: '100%',maxHeight:'60vh' }} className='rounded-md transition-all duration-1000 hover:opacity-70' variant="square" src={Foto} title="Clique para carregar uma imagem" />
                }
            </Box>
        </>
    )
}