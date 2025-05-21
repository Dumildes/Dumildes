import { useEffect, useState } from 'react';
import api from '../../../../../services/api';
import Loading from '../../../../../load/loading';
import Mes from '../../../../../utils/mes';

const ComprovativoAgenda = ({ estabelecimento }) => {
    const [agenda, setAgenda] = useState('')

    useEffect(() => {
        api.get(`/agendas?estabelecimentoId=${estabelecimento._id}&status=Indisponível`)
            .then(response => {
                // console.log(response)
                setAgenda(response.data.agendas[response.data.agendas.length - 1]);
                // setAgenda(response.data.agendas[0]);

            }).catch(error => {
                // console.log(error)
                setAgenda([])
            })
    }, [estabelecimento])

    return (
        agenda ?
            <div style={{ marginTop: 10, padding: 10, backgroundColor: '#51e26e', borderRadius: 5, border: '1px solid', textAlign: 'center' }}>
                <strong style={{ fontSize: 18 }}>
                    Agendado para dia {agenda?.dia} de <Mes mes={agenda?.mes} /> as {agenda?.hora < 10 && 0}{agenda?.hora}:{agenda?.minuto < 10 && 0}{agenda?.minuto}
                </strong>
            </div>
            :
            <Loading />
    );
}

export default ComprovativoAgenda;
