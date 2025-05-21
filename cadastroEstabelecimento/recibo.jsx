import { Typography, Card, Divider } from '@mui/material'
import Loading from '../../../../../load/loading'
import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import DateHora from '../../../../../utils/dateHora';
import HeaderGestorConfigs from '../../../../../utils/headerGestorConfigs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ComprovativoAgenda from './comprovativoAgenda';
import { format, parseISO } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../../../../services/api';
import { useSelector } from 'react-redux';
import LoadingBackdrop from "../../../../../load/loadingBackdrop";
import MessageSuccess from "../../../../../messages/messageSuccess";
import ReenviarEmail from '../reenviarEmail';

const useStyles = makeStyles((theme) => ({
    fundo: {
        margin: 10,
        minHeight: '100%',
        backgroundImage: 'url(/img/logo/logoArmed.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
        position: 'absolute',
        width: '100%',
    }
}))


export default function Recibo({ estabelecimento }) {
    const user = useSelector(state => state.account.user);
    const classes = useStyles();
    const currentYear = new Date().getFullYear();
    const [load, setLoad] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState('');
    const [openReenviarEmail, setOpenReenviarEmail] = useState(false);
    const [novoEmail, setNovoEmail] = useState('');

    const baseUrl = window.location.origin;
    // console.log(user) 
    // const [agendas, setAgendas] = useState('')

    // console.log(novoEmail)

    const generatePDF = (action) => {
        setLoad(action)
        setMessageSuccess('')

        // Criar um novo documento PDF
        const pdf = new jsPDF();

        const larguraMaxima = 165;
        const fonteSansSerif = 'Arial, sans-serif';

        // Adicionar logo e título
        pdf.addImage('/img/logo/InsigniaAngola.png', 'PNG', 90, 15, 23, 23);
        pdf.setFontSize(13);
        pdf.setFont('bold');
        pdf.setFont(fonteSansSerif);
        pdf.text('MINISTÉRIO DA SAÚDE', 105, 45, null, null, 'center');
        pdf.text('AGÊNCIA REGULADORA DE MEDICAMENTOS E TECNOLOGIA DE SAÚDE', 105, 50, null, null, 'center');

        // Adicionar número de recibo
        pdf.setFontSize(12);
        pdf.text(`RECIBO Nº ${estabelecimento?.numeroEntrada} /ARMED/ ${currentYear}`, 105, 70, null, null, 'center');

        pdf.addImage('/img/logo/logoArmed.png', 'PNG', 20, 80, 150, 45, 'FAST', 0.5);

        // Adicionar texto com referências ao estabelecimento
        pdf.text(`Referente a Solicitação de licenciamento do estabelecimento farmacêutico: ${estabelecimento?.nome}`, 20, 80, { maxWidth: larguraMaxima });
        pdf.text(`Localizado na província de ${estabelecimento?.provincia} Município / Distrito de ${estabelecimento?.municipio}`, 20, 86);
        pdf.text(`Bairro ${estabelecimento?.bairro}`, 20, 92);
        pdf.text(`Representante: Sr(A) ${estabelecimento?.empresa?.representante?.dadosPessoais?.nome}`, 20, 98);
        pdf.text(`A entidade deve solicitar a ARMED o agendamento da vistoria após trinta(30) dias úteis, a contar da data de ${format(parseISO(estabelecimento?.createdAt), 'dd-MM-yyyy HH:mm:ss')}`, 20, 104, { maxWidth: larguraMaxima });

        // Adicionar aviso de não autorização
        pdf.setFont('normal');
        pdf.text('=== Este recibo NÃO autoriza a abertura do estabelecimento ===', 105, 130, null, null, 'center');

        // Adicionar aviso de plataforma ARMED
        pdf.text('Gerado pela plataforma ARMED', 185, 140, null, null, 'right');

        // Adicionar rodapé
        pdf.setFontSize(10);
        pdf.setLineWidth(0.5);
        pdf.line(20, 260, 190, 260);

        // Adicionar informações de endereço no rodapé (lado esquerdo)
        pdf.text('Tel.(+244) 945 817 227 ', 20, 270);
        pdf.text('E-mail: expedientegeral@armed.gov.ao | www.armed.gov.ao', 20, 275);
        pdf.text('Rua Cmdt, Che-Guevara nº 86/86A, Maculusso,', 20, 280);
        pdf.text('Luanda - Angola', 20, 285);

        // Adicionar imagem ao lado direito do rodapé
        const footerImagePath = '/img/logo/logoArmed.png'; // Caminho para a imagem do rodapé
        const footerImageWidth = 40; // Largura da imagem do rodapé em porcentagem
        const footerImageHeight = 20; // Altura da imagem do rodapé em porcentagem
        pdf.addImage(footerImagePath, 'png', 150, 265, footerImageWidth, footerImageHeight);
        // Fim rodapé

        // Adicionar QR Code e informações adicionais
        html2canvas(document.getElementById('qrCode')).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 30, 150, 150, 80);

            if (action === 'print') {
                // imprimir PDF
                const pdfBlob = pdf.output('blob');
                // Criar um URL para o Blob
                const pdfUrl = URL.createObjectURL(pdfBlob);
                // Abrir o PDF em uma nova aba
                window.open(pdfUrl, '_blank');
                setLoad(false)
                setMessageSuccess('Sucesso')
            }

            if (action === 'save') {
                // Salvar PDF
                pdf.save(`recibo-de-licenciamento-${estabelecimento.nome}.pdf`);
                setLoad(false)
                setMessageSuccess('Sucesso')
            }


            if (action === 'Enviando_email') {
                const pdfBlob = pdf.output('blob');
                // Criar um objeto FormData para enviar o Blob como um arquivo

                const msg = {
                    to: novoEmail?.toLowerCase() ?? estabelecimento?.email?.toLowerCase(),
                    // from: process.env.SENDER_EMAIL!,
                    subject: `Recibo de Solicitação de Licenciamento`,
                    html:
                        `<h1>Estabelecimento '${estabelecimento?.nome}'</h1
                    <p>
                      A Solicitação de Licenciamento do Estabelecimento <b>${estabelecimento?.nome}</b> com 
                      Recibo nº ${estabelecimento?.numeroEntrada} está em análise, cumprindo todos os
                      requisitos, em altura oportuna enviaremos um email a confirmar a aprovação. 
                    </p>
            
                    <p><b>Nota:</b> Este e-mail foi gerado automaticamente pela plataforma <b>ARMED</b></p>
                    `,
                };

                const formData = new FormData();
                formData.append('to', msg.to); //
                formData.append('subject', msg.subject); //
                formData.append('html', msg.html); //
                formData.append('attachment', pdfBlob, `recibo-de-licenciamento-${estabelecimento?.nome}.pdf`); // O terceiro argumento é o nome do arquivo

                // for (let dado of formData.values()) { console.log(dado); }

                api.post('/email/send', formData)
                    .then(response => {
                        // console.log(response)
                        setOpenReenviarEmail(false)
                        setLoad(false)
                        setMessageSuccess('E-mail enviado com Sucesso')
                    }).catch(err => {
                        setOpenReenviarEmail(false)
                        // console.log(err) 
                        setLoad(false)
                    })
            }
        });
    };

    // ENVIAR EMAIL APENAS QUANDO O USER NAO FOR ADMIN
    useEffect(() => {
        !user?.isAdmin &&
            setTimeout(function () {
                generatePDF('Enviando_email');
            }, 5000);
    }, []);


    return (
        <>
            <Card style={{ padding: 20, marginBottom: 10 }}>
                <LoadingBackdrop open={load} text={load} />
                {messageSuccess && <MessageSuccess message={messageSuccess} />}
                {/* {messageError && <MessageError message={messageError} />} */}

                <ReenviarEmail
                    estabelecimento={estabelecimento}
                    setNovoEmail={setNovoEmail}
                    generatePDF={generatePDF}
                    openReenviarEmail={openReenviarEmail}
                    setOpenReenviarEmail={setOpenReenviarEmail}
                    load={load}
                />

                <HeaderGestorConfigs
                    menu={true}
                    generatePDF={generatePDF}
                    setOpenReenviarEmail={setOpenReenviarEmail}
                    configArea={'recibo'}
                    title={'RECIBO'}
                />

                <div id='recibo' style={{ position: 'relative', padding: 20, maxWidth: 520, minHeight: 850, marginLeft: 'auto', marginRight: 'auto', marginBottom: 20 }}>

                    {estabelecimento ?
                        <>
                            <div align='center' style={{ marginBottom: 30 }} >
                                <img src="/img/logo/InsigniaAngola.png" width={60} alt="Insign" />
                                <Typography variant="h1" style={{ fontSize: 15, fontWeight: 'bold' }}>
                                    MINISTÉRIO DA SAÚDE <br />
                                    AGÊNCIA REGULADORA DE MEDICAMENTOS E TECNOLOGIA DE SAÚDE
                                </Typography>
                            </div>

                            <div align='center' style={{ marginBottom: 30 }}>
                                <Typography style={{ fontSize: 15, }} variant="subtitle1">
                                    RECIBO Nº
                                    <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                        {estabelecimento?.numeroEntrada}
                                    </span>
                                    /ARMED/{currentYear}
                                </Typography>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <div className={classes.fundo} />

                                <Typography >
                                    Referente a Solicitação de licenciamento do estabelecimento farmacêutico:
                                    _//'
                                    <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                        {estabelecimento?.nome}
                                    </span>
                                    '//_
                                </Typography>

                                <Typography >
                                    Localizado na provincia de
                                    <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                        {estabelecimento?.provincia}
                                    </span>
                                    Município / Distrito de
                                    <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                        {estabelecimento?.municipio}
                                    </span>

                                    Bairro
                                    <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                        {estabelecimento?.bairro}
                                    </span>
                                    {/* Ref.
                                <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                    ###
                                </span> */}

                                    <br />
                                    Representante: Sr(A)
                                    <span style={{ fontWeight: 'bold', borderBottom: '1px solid', margin: 5 }}>
                                        {estabelecimento?.empresa?.representante?.dadosPessoais?.nome}
                                    </span>
                                </Typography>

                                <Typography >
                                    A entidade deve solicitar a ARMED o agendamento da vistoria após trinta(30) dias úteis, a contar da data de
                                    <span style={{ fontWeight: 'bold', margin: 5 }}>
                                        <DateHora date={estabelecimento?.createdAt} />
                                    </span>
                                </Typography>
                            </div>

                            <div align='center' style={{ marginTop: 40 }}>
                                <Typography >
                                    === Este recibo NÃO autoriza a abertura do estabelecimento ===
                                </Typography>
                            </div>

                            <br />
                            <div align='end'>
                                <Typography  >
                                    Gerado pela plataforma ARMED
                                </Typography>
                            </div>

                            <div id='qrCode' align='center' style={{ marginTop: 10 }}>
                                <QRCodeSVG value={`${baseUrl}/verifica-estabelecimento/${estabelecimento._id}`} size={150} includeMargin />
                                <br />
                                <small>Acompanha o estado da solicitação pelo código QR</small>
                                <ComprovativoAgenda estabelecimento={estabelecimento} />
                            </div>

                            <div style={{ position: 'absolute', bottom: 0, }}>
                                <Divider style={{ background: '#85287e', marginTop: 20, marginBottom: 10 }} />

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography style={{ fontSize: 11, lineHeight: 1.2, flexGrow: 1, marginRight: 50 }}>
                                        Tel.(+244) 945 817 227 <br />
                                        E-mail: expedientegeral@armed.gov.ao | www.armed.gov.ao <br />
                                        Rua Cmdt, Che-Guevara nº 86/86A, Maculusso, <br />
                                        Luanda - Angola
                                    </Typography>

                                    <img src="/img/logo/logoArmed.svg" width={120} alt="Insign" />
                                </div>
                            </div>
                        </>
                        :
                        <Loading />
                    }
                </div>
            </Card>
        </>
    )
}
