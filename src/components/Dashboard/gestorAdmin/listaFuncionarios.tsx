/// <reference no-default-lib="true"/>
 
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import FichaAdmin from "./fichaAdmin";
import { Loading } from "../../Loading";
import CNPApi from "../../../services/CNPApi";

export default function ListaFuncionarios() {
    const [admins, setAdmins] = useState('')
    const [handleUpdate, setHandleUpdate] = useState('')

    useEffect(() => {
        CNPApi.get('/admins?funcao=CNP')
            .then((response) => {
                console.log(response) 
                setAdmins(response.data.Admins)
            }).catch(() => '')
    }, [handleUpdate])


    return (
        <Container>
            {admins ?
                admins.map((admin) => <FichaAdmin key={admin._id} admin={admin} setHandleUpdate={setHandleUpdate} />)
                :
                <div style={{ marginTop: '40px' }}>
                    <Loading size={20} />
                </div>
            }
        </Container>
    )
}
