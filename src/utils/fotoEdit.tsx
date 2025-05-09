/// <reference no-default-lib="true"/>
/* eslint-disable */
import { useState } from "react";
import { Avatar, Box, Button, Dialog, DialogActions, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import LoadingShort from "../components/load/loadingShort";
import CNPApi from "../services/CNPApi";
import MessageAlert from "../messages/messageAlert";
import { useAuth } from "../contexts/AuthProvider";

const tamanhoImage = 150;

function SimpleDialog(props) {
    const { onClose, open, submitEdit, setEdit, edit, Foto, openLoad, messageSuccess, messageError } = props;

    const handleClose = () => { onClose(false); };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <div style={{ fontFamily: 'Work Sans', lineHeight: 1.5, padding: 10, textAlign: 'center' }}>

                {messageSuccess && <MessageAlert type={'success'} message={messageSuccess} />}
                {messageError && <MessageAlert type={'error'} message={messageError} />}

                <Box className='mb-3 flex justify-center relative'>
                    <div>
                        {edit ? 
                            <Avatar style={{ width: tamanhoImage, height: tamanhoImage, border: '2px solid #ccc' }} className="rounded-md object-cover" src={URL.createObjectURL(edit)} title="Clique para carregar uma imagem" />
                            :
                            <Avatar style={{ width: tamanhoImage, height: tamanhoImage, border: '2px solid #ccc' }} className="rounded-md object-cover" src={Foto} title="Clique para carregar uma imagem" />
                        }
                    </div>

                    <input accept="image/png, image/jpg, image/jpeg" type="file" name="foto" id="foto" style={{ display: 'none' }} onChange={(e) => setEdit(e.target.files[0])} />
                </Box>

                {(edit && !openLoad) ? 
                    <DialogActions>
                        <Button size="small" color="error" onClick={() => setEdit('')}>Cancelar</Button>
                        <Button variant="contained" size="small" color="success" onClick={submitEdit}>Salvar</Button>
                    </DialogActions>
                    :
                    <Button autoFocus style={{ marginRight: 8 }} size="small">
                        <label htmlFor="foto" style={{ cursor: 'pointer', textAlign: 'center' }}>Carregar imagem</label>
                    </Button>
                }

                {openLoad && <LoadingShort text={'A Salvar'} />}
            </div>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function FotoEdit({ dadosPessoais }) {
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
    const [Foto, setFoto] = useState(dadosPessoais?.fotoURL);
    const [edit, setEdit] = useState('');
    const [openLoad, setOpenLoad] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState('');
    const [openEditFoto, setOpenEditFoto] = useState(false);
    const [messageError, setMessageError] = useState('');

    const handleClose = () => {
        setOpenEditFoto(false);
        setEdit('');
    };

    const submitEdit = async () => {
        setOpenLoad(true);
        setMessageSuccess('');
        setMessageError('');

        const formData = new FormData();
        formData.append('foto', edit);
        formData.append('dadosPessoaisId', dadosPessoais._id);
        formData.append('userId', user?._id ?? '');

        await CNPApi.patch('/dados-pessoais/change-foto', formData)
            .then(res => {
                setOpenLoad(false);
                setFoto(res.data.dadosPessoais.fotoURL);
                setEdit('');
                setMessageSuccess('Sucesso.');
            }).catch(err => {
                setOpenLoad(false);
                setMessageError('Não foi possível realizar esta ação.');
            });
    };

    return (
        <>
            <SimpleDialog
                Foto={Foto}
                open={openEditFoto}
                openLoad={openLoad}
                onClose={handleClose}
                submitEdit={submitEdit}
                edit={edit}
                setEdit={setEdit}
                messageSuccess={messageSuccess}
                messageError={messageError}
            />

            <Box onClick={() => setOpenEditFoto(true)} className='mb-3 flex justify-center cursor-pointer relative' style={{ position: 'relative' }}>
                {edit ? 
                    <Avatar style={{ width: tamanhoImage, height: tamanhoImage, border: '2px solid #E12025' }} className='rounded-md transition duration-300 hover:opacity-40 ' src={URL.createObjectURL(edit)} title="Clique para carregar uma imagem" />
                    :
                    <Avatar style={{ width: tamanhoImage, height: tamanhoImage, border: '2px solid #E12025' }} className='rounded-md transition duration-300  hover:opacity-40' src={Foto} title={user?.tipo === 'Admin' ? "Clique para carregar uma imagem" : ''} />
                }

                    <IconButton
                        style={{
                            position: 'absolute',
                            bottom: '10px', 
                            right: '10px',  
                            padding: 6,
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        }}
                        className="text-primary hover:text-primary-dark"
                    >
                        <EditIcon />
                    </IconButton>
            </Box>
        </>
    );
}
