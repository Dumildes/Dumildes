import { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../../../components/Guest/Popup';
import Ordens from '../../../components/Guest/Home/Ordens';
import CNPApi from '../../../services/CNPApi';
import AtuationArea from '../../../components/Guest/Home/AtuationArea';
import AppInstall from '../../../components/Guest/Home/AppInstall';
import Notes from '../../../components/Guest/Home/Notes';
import toast from 'react-hot-toast';
import Cards from '../../../components/Guest/Home/Cards';
import NavSearch from '../../../components/Guest/Home/NavSearch';
import SlideArea from '../../../components/Guest/Home/SlideArea';
import PopupContent from '../../../components/Guest/Home/PopupContent';
// import { ErrorResponse } from '../../../App';
import { Container } from '@mui/material';
import ConsultorPorQrCode from '../../../components/ConsultarQrCode';
import ParalaxCNP from '../../../components/Guest/Home/ParalaxCNP'

export type Ordem = {
    _id: string,
    nome: string,
    email: string,
    profissao: string,
    URL: string,
    serverURL: string,
    local: string,
    logoURL: string,
    approved: boolean,
    prioridade: number,
    status: string,
    tel: number,
    updatedAt: string,
    createdAt: string,
}

export type Announce = {
    _id: string,
    dataDespacho: string,
    descricao: string,
    imagens: string,
    ordem: string,
    pagamento: string,
    status: string,
    tipo: string,
    titulo: string,
    updatedAt: string,
}

export interface OrdensProps {
    ordens: Ordem[]
}

// Definição correta das interfaces
export interface MemberProps {
    members: Member[]
}

export interface DadosPessoais {
    _id: string
    nome: string
    genero: string
    dataNascimento: string
    bi: string
    nif: string
    email: string
    telefone1: string
    telefone2: string
    fotoURL: string
    perfil: string
    bairro: string
    conselho: string
    createdAt: string
    updatedAt: string
}

export interface DadosProfissionais {
    _id: string
    nomeProfissional: string
    telefoneProfissional: string
    telefoneProfissional2: string
    createdAt: string
    updatedAt: string
}

export interface Advogado {
    _id: string
    numeroCarteira: number
    status: string
    aprovado: boolean
    dataInscoaa: string
    dataAdvogado: string
    dataEstagio: string
    formacao: string
    especialidade: string
    dataMinjutso: string
    inserido: boolean
    nomePatrono: string
    cedulaEstagiario: string
    dadosPessoais: string
    dadosProfissionais: string
    createdAt: string
    updatedAt: string
}

export interface DadosPatrono {
    _id: string
    instituicao: string
    funcao: string
    membro: string
    createdAt: string
    updatedAt: string
}

export interface Member {
    _id: string
    numeroCarteira: number
    perfil: string
    status: string
    dadosPessoais: DadosPessoais
    dadosProfissionais: DadosProfissionais
    advogado: Advogado
    conselheiro: boolean
    createdAt: string
    updatedAt: string
    dadosPatrono: DadosPatrono
    nome: string
    dataInicio: string
}

export interface MemberProps {
    members: Member[]
}


function Home() {

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMember, setLoadingMember] = useState(false);
    const [ordensList, setOrdensList] = useState<Ordem[]>([]);
    const [itemSelected, setItemSelected] = useState<Ordem | null>(null);
    const [itemSearch, setItemSearch] = useState<string>("");
    const [members, setMembers] = useState<Member[]>([]);
    const [membersOriginal, setMembersOriginal] = useState<Member[]>([]);

    useEffect(() => {

        const fetchOrdens = async () => {
            setLoading(true)

            try {
                const response = await CNPApi.get('/ordems');

                // Certifique-se de que o dado recebido é do tipo Ordem[]
                const ordens: Ordem[] = response.data.ordens;
                setOrdensList(ordens);

            } catch (err) {

                console.log(err);

            } finally {
                setLoading(false);
            }
        }

        fetchOrdens();

    }, []);

    const openPopup = () => setIsOpen(true);

    const closePopup = () => {

        if (members?.length === 1 && membersOriginal.length > 1) {
            setMembers(membersOriginal);
            return;
        }

        setItemSelected(null);
        setItemSearch("");
        setMembers([]);
        setMembersOriginal([]);
        setIsOpen(false);
    };

    const handleOnChange = (item: string) => {
        if (item) {
            const ordem = JSON.parse(item);
            // Agora você tem acesso ao objeto ordem completo
            setItemSelected(ordem);
            setItemSearch("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!itemSearch) {
            toast.error("Insira a carteira ou o nome");
            return;
        }

        try {
            setLoadingMember(true);

            const response = await axios.post(`${itemSelected?.serverURL}membro/search?perPage=20`, { 'search': itemSearch });

            setMembers(response.data.membros);
            setMembersOriginal(response.data.membros);

        } catch (err) {
            const error = err as ErrorResponse;
            if (error.response?.data?.message)
                toast.error(error.response.data.message);
            else
                toast.error("Falha na conexão de rede");

        } finally {
            setLoadingMember(false);
        }
    }

    const handleMemberRedirect = (member: Member) => {
        setLoadingMember(true);
        setMembers([member]);
        setLoadingMember(false);
    }

    return (

        <section >

            <div>
                <SlideArea />
                <NavSearch openPopup={openPopup} />
            </div>

            <div className='flex flex-col gap-40'>
                <Container className='flex flex-col gap-40'>
                    <Cards />
                </Container>

                <ParalaxCNP />

                <Container>

                    <Ordens
                        ordens={ordensList}
                        loading={loading}
                    />

                    <AtuationArea />

                    <AppInstall />

                    <Notes />
                </Container>
            </div>

            <ConsultorPorQrCode
                setIsOpen={setIsOpen}
                setPesquisa={setMembers}
                setItemSelected={setItemSelected}
                // setPesquisaError={setPesquisaError}
                setLoad={setLoadingMember}
            />

            <Popup
                closePopup={closePopup}
                content={
                    <PopupContent
                        loadingMember={loadingMember}
                        members={members}
                        itemSelected={itemSelected}
                        handleMemberRedirect={handleMemberRedirect}
                        setItemSelected={setItemSelected}
                        handleSubmit={handleSubmit}
                        setItemSearch={setItemSearch}
                        ordens={ordensList}
                        handleOnChange={handleOnChange}
                    />
                }
                isOpen={isOpen}
            />
        </section>
    )
}

export default Home
