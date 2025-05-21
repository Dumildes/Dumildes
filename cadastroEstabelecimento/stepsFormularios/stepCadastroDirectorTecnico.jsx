
import { useDispatch, useSelector } from 'react-redux';
import { InputBase, IconButton, Typography, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../../../../services/api";
import MessageError from "../../../../../../messages/messageError";
import CadastroDirectorTecnico from "../../../../../gestDirectorTecnico/cadastroDirectorTecnico";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LoadingShort from "../../../../../../load/loadingShort";
import FichaDirectorTecnico from '../../../../../gestDirectorTecnico/fichaDirectorTecnico';


export default function FormCadastroDirectorTecnico({changeDirectorTecnico}) {
    // changeDirectorTecnico ESTA VARIAVEL E USADA QUANDO MAMO ESTE COMPONENTE NO COMPONENTE <ChangeDirectorTecnico/>

    // const navigate = useNavigate()
    // const user = useSelector(state => state.account.user);
    const directorTecnico = useSelector(state => state.dadosdirectorTecnico.data)
    const [load, setLoad] = useState('')
    const [pesquisaError, setPesquisaError] = useState('')
    const [search, setSearch] = useState(false)
    const dispatch = useDispatch()

    const searchDirectorTecnico = async (e) => {
        e.preventDefault()
        setPesquisaError(null)
        setLoad(true)
        setPesquisaError('')

        dispatch({
            type: 'dadosdirectorTecnico',
            payload: { dadosdirectorTecnico: null }
        })

        try {
            const response = await api.post(`/director-tecnico/search`, {search});
            setLoad(false)
            // console.log(response)

            if (response.data.directorTecnicos.length < 1) {
                setPesquisaError('Nenhum Director Técnico encontrado');
              }


            dispatch({
                type: 'dadosdirectorTecnico',
                payload: { dadosdirectorTecnico: response.data.directorTecnicos[0] }
            })

        } catch (error) {
            // console.log(error)
            setPesquisaError(error.response.data.message);
            setLoad(false)

            dispatch({
                type: 'dadosdirectorTecnico',
                payload: { dadosdirectorTecnico: null }
            })
        }
    }

    return (
        <>
            <Box style={{ margin: 10 }}>

                {pesquisaError &&
                    <MessageError message={pesquisaError} />
                }

                <br />
                <form onSubmit={searchDirectorTecnico} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                    <Typography noWrap style={{ marginRight: 15 }} variant="subtitle1">
                        <strong>
                            Pesquisar Director Técnico
                        </strong>
                    </Typography>

                    <InputBase
                        type="text"
                        size="small"
                        required
                        style={{ minWidth: 300, width: '32%', border: '1px solid ', padding: 5, borderRadius: 15, fontSize: 16, }}
                        placeholder="Insirir nº B.I do Director Técnico"
                        defaultValue={directorTecnico?.dadosPessoais?.numeroBi}
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

            <br />
            {(directorTecnico?._id || changeDirectorTecnico)
                ?
                <FichaDirectorTecnico directorTecnico={directorTecnico} />
                :
                // AQUI ESTOU A ENVIAR usedataRepresentante COMO PARAMETRO PARA TER POSSIBILIDADE DE USAR OS MESMOS DADOS DE REPRESENTANTE PARA O DT 
                <CadastroDirectorTecnico usedataRepresentante={true} />
            }
        </>
    )
}