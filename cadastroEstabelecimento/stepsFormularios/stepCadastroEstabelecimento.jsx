import TextField from '@material-ui/core/TextField';
import { Box, Grid, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import FormAnexarDocumentosInscricao from "./stepAnexarDocumentosInscricao";
import FormAnexarDocumentosRenovacao from './stepAnexarDocumentosRenovacao';
import { Avatar, MenuItem, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import apiCNP from '../../../../../../services/apiCNP';
import api from '../../../../../../services/api';
// import compressImage from '../../../../../../services/compressImage';


const useStyles = makeStyles({
    gridItem: { margin: 8 }
})

export default function FormCadastroEstabelecimento({ tipoRegisto }) {
    const dispatch = useDispatch()
    const classes = useStyles()
    const dadosCadastroEstabelecimento = useSelector(state => state.dadosCadastroEstabelecimento.data)
    const [cadastroEstabelecimento, setCadastroEstabelecimento] = useState(dadosCadastroEstabelecimento)
    const [municipios, setMunicipios] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [tipoEstabelecimentos, setTipoEstabelecimentos] = useState([])
    // const user = useSelector(state => state.account.user);

    useEffect(() => {
        dispatch({
            type: 'cadastroEstabelecimento',
            payload: {
                dadosCadastroEstabelecimento: cadastroEstabelecimento
            }
        })
    }, [cadastroEstabelecimento, dispatch])


    useEffect(() => {
        apiCNP.get('/provincias')
            .then(res => {
                setProvincias(res.data.provincias);
            })
            .catch(err => '')

        dadosCadastroEstabelecimento?.provinciaId &&
            apiCNP.get(`/municipios-by-provincia/${dadosCadastroEstabelecimento?.provinciaId}`)
                .then(res => {
                    setMunicipios(res.data.municipios);
                })
                .catch(err => '')

        api.get('/tipo-estabelecimentos')
            .then(res => {
                // console.log(res)
                setTipoEstabelecimentos(res.data.tipoEstabelecimentos);
            }).catch(err => '')
    }, [dadosCadastroEstabelecimento?.provinciaId])


    async function HandleChangeFile(file, name) {
        setCadastroEstabelecimento((prevCadastro) => ({ ...prevCadastro, [name]: file }))
    }
    
    async function HandleChange(e) {
        // await compressImage(e.target.files[0])
        e.target.files ?
            setCadastroEstabelecimento((prevCadastro) => ({ ...prevCadastro, [e.target.name]: e.target.files[0] }))
            :
            setCadastroEstabelecimento((prevCadastro) => ({ ...prevCadastro, [e.target.name]: e.target.value }))

        if (e.target.name === 'provinciaId') {

            setCadastroEstabelecimento((prevCadastro) => ({ ...prevCadastro, municipio: '' }));
            await apiCNP.get(`/municipios-by-provincia/${e.target.value}`)
                .then(res => {
                    setMunicipios(res.data.municipios);
                    setCadastroEstabelecimento((prevCadastro) => ({ ...prevCadastro, provincia: res.data.provincia.designacao }));
                })
                .catch(err => '')
        }

        dispatch({
            type: 'cadastroEstabelecimento',
            payload: { dadosCadastroEstabelecimento: cadastroEstabelecimento }
        })
    }

    return (
        <Box>
            <Typography variant="h5" style={{ margin: 15 }}>
                DADOS DO ESTABELECIMENTO
            </Typography>

            <Grid container alignItems='flex-end' >
                <Grid xs={12} md={2} item className={classes.gridItem} >
                    <Paper style={{ border: '1px dashed #3e3d3f' }}>
                        <label htmlFor="foto" style={{ cursor: 'pointer', textAlign: 'center' }}>
                            {dadosCadastroEstabelecimento?.logo ?
                                <>
                                    {/* <img src={URL.createObjectURL(representante.foto)} alt="Imagem" width="100%" title="alterar foto.." /> */}
                                    <Avatar style={{ width: '100%', height: 145 }} variant="square" src={URL.createObjectURL(dadosCadastroEstabelecimento.logo)} title="Clique para carregar uma imagem" />
                                </>
                                :
                                <div style={{ padding: 5 }}>
                                    <img style={{ height: 100 }} src='/img/avatar/avatarEstabelecimento.svg' title="Clique para carregar uma imagem" />
                                    <br />
                                    <small>Foto Exterior Estabelecimento</small>
                                </div>
                            }
                            <input accept="image/png, image/jpg, image/jpeg" type="file" name="logo" id="foto" style={{ display: 'none' }} onChange={HandleChange} />
                        </label>
                    </Paper>
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                    <TextField
                        type="text"
                        label="Nome "
                        fullWidth
                        size="small"
                        name="nome"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.nome}
                    />
                    <TextField
                        style={{ marginTop: 15 }}
                        type="email"
                        label="E-mail "
                        fullWidth
                        size="small"
                        name="email"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.email}
                    />

                    <Grid container style={{ marginTop: 15 }}>
                        <Grid xs={12} md item >
                            <TextField
                                // disabled={!user?.isAdmin}
                                required
                                type="text"
                                label="Tipo de Estabelecimento"
                                select
                                fullWidth
                                size="small"
                                name="tipoId"
                                variant="outlined"
                                onChange={HandleChange}
                                defaultValue={dadosCadastroEstabelecimento?.tipoId ?? ''}
                            >
                                <MenuItem disabled value=''>Selecione Tipo de Estabelecimento</MenuItem>
                                {tipoEstabelecimentos?.map((estabelecimento) => (
                                    (estabelecimento._id !== '65096f490a1e077d5cdc0dd1' && estabelecimento._id !== '6601640b64a30dae27720b28') &&
                                    <MenuItem key={estabelecimento._id} value={estabelecimento._id}>
                                        {estabelecimento?.designacao.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container >
                <Grid xs={12} md item className={classes.gridItem}>
                    <TextField
                        required
                        type="text"
                        label="Províncía"
                        select
                        fullWidth
                        size="small"
                        name="provinciaId"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.provinciaId ?? ''}
                    >
                        <MenuItem disabled value=''>Selecione Províncía</MenuItem>
                        {provincias?.map((provincia) => (
                            <MenuItem key={provincia._id} value={provincia._id}>
                                {provincia.designacao}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                    <TextField
                        disabled={!dadosCadastroEstabelecimento?.provinciaId}
                        required
                        type="text"
                        label="Município"
                        select
                        fullWidth
                        size="small"
                        name="municipio"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.municipio ?? ''}
                    >
                        <MenuItem disabled value=''>Selecione Município</MenuItem>
                        {municipios?.map((municipio) => (
                            <MenuItem key={municipio._id} value={municipio.designacao}>
                                {municipio.designacao}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                    <TextField
                        required
                        type="text"
                        label="Endereço"
                        fullWidth
                        size="small"
                        name="rua"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.rua}
                    />
                </Grid>
            </Grid>

            <Grid container >
                <Grid xs={12} md item className={classes.gridItem}>
                    <TextField
                        required
                        type="text"
                        label="Bairro"
                        fullWidth
                        size="small"
                        name="bairro"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.bairro}
                    />
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                    <TextField
                        required
                        type="number"
                        label="Número de carteira do Arquitecto"
                        fullWidth
                        size="small"
                        name="carteiraArquitecto"
                        variant="outlined"
                        onChange={HandleChange}
                        defaultValue={dadosCadastroEstabelecimento?.carteiraArquitecto}
                    />
                </Grid>
                <Grid xs={12} md item className={classes.gridItem}> </Grid>
            </Grid>



            {/* PARA CASO DE RENOVACAO OU INSERCAO DE ESTABELECIMENTOS */}
            {(tipoRegisto === 'Inserção') &&
                <>
                    <Grid container >
                        <Grid xs={12} md item className={classes.gridItem}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Número de Processo "
                                size="small"
                                name="numeroProcesso"
                                variant="outlined"
                                onChange={HandleChange}
                                defaultValue={dadosCadastroEstabelecimento?.numeroProcesso}
                            />
                        </Grid>

                        <Grid xs={12} md item className={classes.gridItem}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Número de Autorização"
                                size="small"
                                name="numeroAutorizacao"
                                variant="outlined"
                                onChange={HandleChange}
                                defaultValue={dadosCadastroEstabelecimento?.numeroAutorizacao}
                            />
                        </Grid>
                        <Grid xs={12} md item className={classes.gridItem}> </Grid>
                    </Grid>


                    {/* DADOS DO SOLICITANTE */}
                    <Grid container >
                        <Grid xs={12} md item className={classes.gridItem}>

                            <TextField
                                required
                                type="text"
                                label="Nome (Solicitante)"
                                fullWidth
                                size="small"
                                name="nomeSolicitante"
                                variant="outlined"
                                onChange={HandleChange}
                                defaultValue={dadosCadastroEstabelecimento?.nomeSolicitante}
                            />
                        </Grid>

                        <Grid xs={12} md item className={classes.gridItem}>
                            <TextField
                                required
                                type="text"
                                label="Nº de B.I (Solicitante)"
                                fullWidth
                                size="small"
                                name="numeroBISolicitante"
                                variant="outlined"
                                onChange={HandleChange}
                                defaultValue={dadosCadastroEstabelecimento?.numeroBISolicitante}
                            />
                        </Grid>

                        <Grid xs={12} md item className={classes.gridItem}>
                            <TextField
                                required
                                type="text"
                                label="Tipo de ligação com o Estabelecimento"
                                fullWidth
                                size="small"
                                name="ligacaoEstabelecimento"
                                variant="outlined"
                                onChange={HandleChange}
                                defaultValue={dadosCadastroEstabelecimento?.ligacaoEstabelecimento}
                            />
                        </Grid>
                    </Grid>
                </>
            }


            <br />
            {/* ANEXO DE DOCUMENTOS */}
            {tipoRegisto === 'Inserção' ?
                <FormAnexarDocumentosRenovacao HandleChange={HandleChangeFile} />
                :
                <FormAnexarDocumentosInscricao HandleChange={HandleChangeFile} />
            }
        </Box>
    )
}
