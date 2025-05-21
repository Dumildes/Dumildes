import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import Cadastro from "./index"
import HeaderSession from '../../../../../utils/headerSession'
import { useParams } from 'react-router-dom'
import api from '../../../../../services/api'
import RegisterAccess from '../../../../../utils/registerAccess'


export default function CadastroEstabelecimentoAdmin() {
  const { idAgenda } = useParams()
  const [agenda, setAgenda] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    idAgenda &&
      api.get(`/agenda/${idAgenda}`)
        .then(response => {
          // console.log(response)
          setAgenda(response.data.agenda);

        }).catch(error => {
          setMessage(error.response.data.message)
          // console.log(error)
        })
  }, [idAgenda])

  return (
    <Container >
      <RegisterAccess page={'cadastro de estabelecimento'} />
      <HeaderSession title='CADASTRO DE ESTABELECIMENTO' />
      <Cadastro tipoRegisto={'Inserção'} agenda={agenda} message={message} />

    </Container>
  )
}
