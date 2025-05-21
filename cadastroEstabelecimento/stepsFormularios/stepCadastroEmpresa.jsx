import { Box, Typography } from "@material-ui/core"
import { useDispatch, useSelector } from 'react-redux';
import { InputBase, IconButton } from "@mui/material";
import { useState } from "react";
import MessageError from "../../../../../../messages/messageError";
import CadastroEmpresaLicenciamento from "../../../../../gestEmpresas/formCadastroEmpresa";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import api from "../../../../../../services/api";
import FichaEmpresa from "../../../../../gestEmpresas/fichaEmpresa";
import LoadingShort from "../../../../../../load/loadingShort";


export default function FormCadastroEmpresa() {
    const dadosEmpresa = useSelector(state => state.dadosEmpresa.data)
    const [nif, setNif] = useState('')
    const [pesquisaError, setPesquisaError] = useState('')
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    // console.log(dadosEmpresa)

    const search = async (e) => {
        e.preventDefault()
        setPesquisaError(null)
        setLoad(true)
        setPesquisaError('')

        dispatch({
            type: 'dadosEmpresa',
            payload: { dadosEmpresa: null }
        })
        dispatch({
            type: 'dadosRepresentante',
            payload: { dadosRepresentante: null }
        })

        try {
            const response = await api.get(`/empresa/nif/${nif}`);
            setLoad(false)

            dispatch({
                type: 'dadosEmpresa',
                payload: { dadosEmpresa: response.data.empresa }
            })
            dispatch({
                type: 'dadosRepresentante',
                payload: { dadosRepresentante: response.data.empresa.representante }
            })

        } catch (error) {
            // console.log(error)
            setPesquisaError(error.response.data.message);
            setLoad(false)

            dispatch({
                type: 'dadosEmpresa',
                payload: { dadosEmpresa: null }
            })
        }
    }

    return (
        <>
            <br />
            {/* IMPUT PARA PESQUISAR EMPRESA CASO JÁ ESTEJA CADASTRADA NA ARMED */}
            <Box style={{ margin: 10 }}>
                {pesquisaError &&
                    <MessageError message={pesquisaError} />
                }

                <form onSubmit={search} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                    <Typography noWrap style={{ marginRight: 15 }} variant="subtitle1">
                        <strong>
                            Pesquisar dados da Empresa
                        </strong>
                    </Typography>

                    <InputBase
                        type="text"
                        size="small"
                        required
                        style={{ minWidth: 200, width: '33%', border: '1px solid ', padding: 5, borderRadius: 15, fontSize: 16, textAlign: 'center' }}
                        placeholder="Insira o NIF da Empresa"
                        defaultValue={''}
                        onChange={(e) => setNif(e.target.value)}
                    />
                    <IconButton title="Pesquisr" style={{ marginLeft: -40 }} align='center' type="submit" aria-label="search">
                        {load ?
                            <LoadingShort />
                            :
                            <SearchOutlinedIcon />
                        }
                    </IconButton>
                </form>
            </Box>

            {/* CASO A EMPRESA JA ESTÁ REGISTADO NA ARMEDO, ESQUISADA PELO NIF E APARECE A FICHA DA EMPRESA CASO CONTRARIO É EXIBIDO O FORMUALRIO PARA CADASTRAR A EMPRESA */}
            {dadosEmpresa?._id ?
                <FichaEmpresa empresa={dadosEmpresa} />
                :
                <CadastroEmpresaLicenciamento />
            }
        </>
    )
}