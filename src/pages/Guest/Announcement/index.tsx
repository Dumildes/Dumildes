import { useEffect, useState } from "react";
import CNPApi from "../../../services/CNPApi";
import Slider from "../../../components/Guest/Announcement/Slider";
import Popup from "../../../components/Guest/Popup";
import ContentPopup from "../../../components/Guest/Announcement/ContentPopup";
import { ErrorResponse } from "../../../App";
import toast from "react-hot-toast";

export interface Announcement {
    _id: string;
    titulo: string;
    tipo: string;
    imagens: string[];
    anunciante: {
        _id: string;
        nif: string;
        tel: string;
        email: string;
        status: string;
        dataDespacho: string;
        nome: string;
        perfil: string;
        createdAt: string;
        updatedAt: string;
    };
    dataDespacho: string;
    status: string;
    descricao: string;
    ordem: string;
    createdAt: string;
    updatedAt: string;
}

export interface AnnouncementProps {
    announcements: Announcement[];
}

const SliderAnnouncementSkeleton = () => (

    <div className="relative md:h-[70vh] h-[40vh]">
        {/* Imagem de fundo com efeito Skeleton */}
        <div className="absolute inset-0 bg-gray-50 animate-pulse"></div>

        {/* Overlay com opacidade */}
        <div className="absolute inset-0 bg-black opacity-5"></div>

        {/* Conteúdo sobre a imagem */}
        <div className="absolute inset-0 flex flex-col items-start md:justify-center justify-end mb-4 md:mb-0">
            <div className="lg:w-[30%] w-[80vw] h-[20vh] md:h-[30vh] bg-white text-black bg-opacity-60 lg:bg-opacity-100 lg:mx-16 mx-2 md:mx-8 flex flex-col gap-2 md:gap-4 md:p-6 p-4 rounded-xl shadow-xl">
                {/* Skeleton para o título */}
                <div className="h-6 w-3/4 bg-gray-300 animate-pulse rounded"></div>

                {/* Skeleton para a descrição */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-300 animate-pulse rounded"></div>
                </div>

            </div>
        </div>


    </div>
)

export default function Announcement() {

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [originalAnnouncements, setOriginalAnnouncements] = useState<Announcement[]>([]);
    const [contentPopup, setContentPopup] = useState<Announcement | null>(null);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    const openPopup = (announcement: Announcement) => {
        setIsOpen(true);
        setContentPopup(announcement);
    };

    const closePopup = () => {
        setIsOpen(false);
        setContentPopup(null);
    };

    const filters = [
        { item: 'Tudo' },
        { item: 'Vaga' },
        { item: 'Produto' },
        { item: 'Evento' },
    ];

    const [itemFilter, setItemFilter] = useState(filters[0].item);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const announcements = await CNPApi.get('/anuncios?status=Activo');
                setAnnouncements(announcements.data.anuncios);
                setOriginalAnnouncements(announcements.data.anuncios);
            } catch (err) {
                const error = err as ErrorResponse;
                if (error.response?.data?.message)
                    toast.error(error.response.data.message);
                else
                    toast.error("Falha na conexão de rede");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // Mudar a imagem a cada 6 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % announcements.length
            );
        }, 6000);

        return () => clearInterval(interval);
    }, [announcements.length]);

    useEffect(() => {
        const handleFilterItem = () => {
            if (itemFilter === 'Tudo') {
                setAnnouncements(originalAnnouncements);
            } else {
                const filtered = originalAnnouncements.filter(
                    (announcement) => announcement.tipo === itemFilter
                );
                setAnnouncements(filtered);
            }
        };

        handleFilterItem();
    }, [itemFilter, originalAnnouncements]);


    return (
        <div className='grid md:gap-14 gap-10 text-sm lg:px-20 pt-10 p-4 h-full mt-16'>
            {loading ? (
                <SliderAnnouncementSkeleton />
            ) : (
                <>
                    <div className="relative md:h-[70vh] h-[40vh]">
                        {/* Imagem de fundo */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url("${announcements[currentIndex]?.imagens[0]}")`,
                                backgroundSize: 'cover',
                            }}
                        ></div>

                        {/* Overlay com opacidade */}
                        <div className="absolute inset-0 bg-black opacity-50"></div>

                        {/* Conteúdo sobre a imagem */}
                        <div className="absolute inset-0 flex flex-col items-start md:justify-center justify-end mb-4 md:mb-0">
                            <div className="lg:w-[30%] w-[80vw] h-[20vh] md:h-[30vh] bg-white text-black bg-opacity-60 lg:bg-opacity-100 lg:mx-16 mx-2 md:mx-8 flex flex-col gap-2 md:gap-4 md:p-6 p-4 rounded-xl shadow-xl">
                                <h1 className="xl:text-3xl lg:text-2xl text-xl font-semibold">
                                    {announcements[currentIndex]?.titulo}
                                </h1>
                                <p className="text-xs line-clamp-5">{announcements[currentIndex]?.descricao}</p>
                            </div>
                        </div>

                        <div>
                            {/* Pontos do carrossel */}
                            <div className="absolute hidden lg:flex lg:flex-col gap-2 lg:right-4 lg:top-1/2 transform -translate-y-1/2">
                                <div></div>
                                {announcements.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                                        onClick={() => setCurrentIndex(index)} // Atualiza o índice ao clicar
                                        style={{ cursor: 'pointer' }} // Adiciona o cursor de ponteiro para indicar interatividade
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="flex items-center justify-center gap-10">
                            {filters.map((filter, index) => (
                                <p
                                    key={index}
                                    onClick={() => setItemFilter(filter.item)}
                                    className={`cursor-pointer duration-300 ${itemFilter === filter.item && 'font-bold border-b-2 border-red-600'}`}
                                >
                                    {filter.item}
                                </p>
                            ))}
                        </div>

                        <hr />

                    </div>

                    {announcements.length > 0 ? (
                        <Slider
                            announcements={announcements}
                            openPopup={openPopup}
                        />
                    ) : (
                        <div className="flex items-center justify-center">
                            <p>Nenhum anúncio encontrado...</p>
                        </div>
                    )}
                </>
            )}

            {contentPopup &&
                <Popup
                    closePopup={closePopup}
                    content={
                        <ContentPopup
                            contentPopup={contentPopup}
                        />
                    }
                    isOpen={isOpen}
                />

            }
        </div>
    );
}
