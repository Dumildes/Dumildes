/// <reference no-default-lib="true"/>
/* eslint-disable */
import { Box, Card, Typography } from "@mui/material";
import { useState, useEffect } from "react";
// import printerService from "@/utils/printer";
// import DadosPessoalEdit from "../membros/dadosGenericos/dadosPessoalEdit";
import FotoEdit from "../../../utils/fotoEdit";
import QRCode from "../../../utils/qrCode";
import { HeaderGestorConfigs } from "../../../utils/headerGestorConfigs";
import { Loading } from "../../Loading";

interface Admin{
    _id: string;
    assinatura: string;
    dadosPessoais:{
        _id: string;
        nome: string;
        perfil: string;
        bi: string;
        email: string;
        telefone1: string;
        telefone2: string;
        bairro: string;
        rua: string;
    }
}

export default function FichaAdmin({ admin, setHandleUpdate }) {
    // const user = useSelector(state => state.account.user);
    const [editDados, setEditDados] = useState(false);
    const [dadosPessoalAdmin, setDadosPessoalAdmin] = useState<Admin | null>(null); // Inicialmente null
    const [openEditFoto, setOpenEditFoto] = useState(false);
    const [editPassword, setEditPassword] = useState()
    const baseUrl = window.location.origin;

    useEffect(() => {
        if (admin) {
            setDadosPessoalAdmin(admin); // Apenas define quando admin existe
        }
    }, [admin]);

    const printQrCode = (qrCodeAdmin) => {
        var preview = document.getElementById(qrCodeAdmin);
        preview.style = "display: block";
        printerService.printer(qrCodeAdmin);
        preview.style = "display: none";
    };

    if (!dadosPessoalAdmin) { return <Loading size={30} /> }

    return (
        <>
            <br />
            <Card style={{ padding: 20, minHeight: "20vh" }}>
                <div className="px-6">
                    <HeaderGestorConfigs
                        menu={true}
                        configArea={"fichaAdmin"}
                        title={dadosPessoalAdmin?.dadosPessoais?.nome}
                        editDados={editDados}
                        setEditDados={setEditDados}
                        dadosPessoalAdmin={dadosPessoalAdmin}
                        setOpenEditFoto={setOpenEditFoto}
                        printQrCode={printQrCode}
                    />
                </div>

                {editDados === false && (
                    <Box className="flex w-full flex-col md:flex-row gap-4 mt-6 px-6">
                        <Box className="">
                            <FotoEdit
                                openEditFoto={openEditFoto}
                                setOpenEditFoto={setOpenEditFoto}
                                dadosPessoais={dadosPessoalAdmin?.dadosPessoais}
                            />

                            <div>
                                <Typography align="center" style={{ fontFamily: 'Work Sans', lineHeight: 1.5 }} variant="body1">
                                    <strong>Função</strong> <br />
                                    {dadosPessoalAdmin?.dadosPessoais?.perfil}
                                </Typography>
                            </div>
                        </Box>

                        <Box className="w-full">
                            <Box
                                style={{ padding: 20 }}
                                className="md:h-[270px] flex gap-6 md:justify-between flex-col md:flex-row"
                            >
                                <div>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>Nome:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.nome || "N/A"}
                                    </Typography>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>BI:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.numeroBI || "N/A"}
                                    </Typography>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>E-mail:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.email || "N/A"}
                                    </Typography>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>Telefone1:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.tel1 || "N/A"}
                                    </Typography>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>Telefone2:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.tel2 || "N/A"}
                                    </Typography>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>Rua:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.rua || "N/A"}
                                    </Typography>
                                    <Typography
                                        style={{ lineHeight: 1.5 }}
                                        variant="subtitle1"
                                    >
                                        <strong>Bairro:</strong>{" "}
                                        {dadosPessoalAdmin?.dadosPessoais?.bairro || "N/A"}
                                    </Typography>
                                </div>
                                <div>
                                    {/* <QRCode
                                        link={`${baseUrl}/verifica-tecnico/${dadosPessoalAdmin?._id}`}
                                    /> */}
                                </div>
                            </Box>

                            <img width={"50%"} src={dadosPessoalAdmin?.assinatura} />

                        </Box>

                        <div id={dadosPessoalAdmin?.dadosPessoais?._id} style={{ display: "none" }}>
                            <QRCode link={`${baseUrl}/verifica-tecnico/${dadosPessoalAdmin?._id}`} />
                            <br />
                            {dadosPessoalAdmin?.dadosPessoais?.nome}
                        </div>
                    </Box>
                )}

                {/* {editDados === "dadosPessoais" && (
                    <DadosPessoalEdit
                        dadosPessoais={admin?.dadosPessoais}
                        setDadosPessoal={setDadosPessoalAdmin}
                        cancelEdite={setEditDados}
                    />
                )} */}

                {/* {editDados === "senha" && (
                    <EditeSenha user={admin} cancelEdite={setEditDados} />
                )} */}
            </Card>
        </>
    );
}
