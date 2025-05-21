
import { useState } from "react"
import { Box, Typography } from "@material-ui/core"
import { useDispatch, useSelector } from 'react-redux';
import { InputBase, IconButton } from "@mui/material";
import CadastroRepresentante from "../../../../../gestRepresentantes/cadastroRepresentante";
import MessageError from "../../../../../../messages/messageError";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LoadingShort from "../../../../../../load/loadingShort";
import FichaRepresentante from "../../../../../gestRepresentantes/fichaRepresentante";
import api from "../../../../../../services/api";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function StepCadastroRepresentante({ changeRepresentante }) {
    // changeRepresentante ESTA VARIAVEL E USADA QUANDO  CHAMO ESTE COMPONENTE NO COMPONENTE <changeRepresentante/>

    const dispatch = useDispatch()
    const dadosEmpresa = useSelector(state => state.dadosEmpresa?.data)
    const dadosRepresentante = useSelector(state => state.dadosRepresentante?.data)
    const [search, setSearch] = useState('')
    const [pesquisaError, setPesquisaError] = useState('')
    const [load, setLoad] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        setPesquisaError(null)
        setLoad(true)

        dispatch({
            type: 'dadosRepresentante',
            payload: { dadosRepresentante: null }
        })

        try {
            const response = await api.post('/representante/search/', { search });
            setLoad(false)
            setPesquisaError('')
            //   console.log(response)

            if (response.data.representantes.length < 1) {
                setPesquisaError('Nenhum representante encontrado');
            }

            dispatch({
                type: 'dadosRepresentante',
                payload: { dadosRepresentante: response.data.representantes[0] }
            })

        } catch (error) {
            // console.log(error)
            setPesquisaError(error.response.data.message);
            setLoad(false)

            dispatch({
                type: 'dadosRepresentante',
                payload: { dadosRepresentante: null }
            })
        }
    }

    return (
        <>
            <br />
            {/* PARA IMPEDIR PESQUISAR REPRESENTANTE CASO JA EXISTA EMPRESA */}
            {!dadosEmpresa?._id &&

                <Box>
                    {(pesquisaError && !load) &&
                        <MessageError message={pesquisaError} />
                    }

                    <br />
                    <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginRight: 15 }}>
                        <Typography noWrap style={{ marginRight: 15 }} variant="subtitle1">
                            <strong>
                                Pesquisar representante
                            </strong>
                        </Typography>

                        <InputBase
                            type="text"
                            size="small"
                            required
                            style={{ minWidth: 300, width: '32%', border: '1px solid ', padding: 5, borderRadius: 15, fontSize: 16, }}
                            placeholder="Insirir nº B.I do Representante"
                            defaultValue={dadosRepresentante?.dadosPessoais?.numeroBI}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IconButton style={{ marginLeft: -40 }} align='center' type="submit" aria-label="search">
                            {load ?
                                <LoadingShort />
                                :
                                <SearchOutlinedIcon />
                            }
                        </IconButton>
                    </form>
                </Box>
            }

            {(dadosRepresentante?._id || changeRepresentante) ?
                <FichaRepresentante representante={dadosRepresentante} />
                :
                <CadastroRepresentante />
            }
        </>
    )
}