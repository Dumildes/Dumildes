import { useEffect, useState } from "react";
import { ErrorResponse } from "../../../../App";
import toast from "react-hot-toast";
import CNPApi from "../../../../services/CNPApi";

export interface Carousel {
    _id: string,
    imagem: string,
    titulo: string,
    descricao: string,
    status: string,
    admin: string,
    dataDespacho: string,
    createdAt: string,
    updatedAt: string,
}

export default function SlideArea() {

    const [carousels, setCarousels] = useState<Carousel[]>([{
        _id: '',
        imagem: '',
        titulo: '',
        descricao: '',
        status: '',
        admin: '',
        dataDespacho: '',
        createdAt: '',
        updatedAt: '',
    }]);

    const [currentIndex, setCurrentIndex] = useState(0);

    // Mudar a imagem a cada 6 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % carousels.length
            );
        }, 6000);

        return () => clearInterval(interval);
    }, [carousels.length]);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const response = await CNPApi.get("/carousels");
                setCarousels(response.data.carousels);
            } catch (err) {
                const error = err as ErrorResponse;
                if (error.response?.data?.message)
                    toast.error(error.response.data.message);
                else
                    toast.error("Falha na conexão de rede");
            }
        }

        fetchData();

    }, [])

    return (
        <div className="relative mt-20 md:h-[70vh] h-[50vh]"> {/* Ajuste a altura conforme necessário */}
            {/* Imagem de fundo */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("${carousels[currentIndex]?.imagem}")`,
                    backgroundSize: 'cover',
                }}
            ></div>

            {/* Overlay com opacidade */}
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Conteúdo em cima do overlay */}
            <div className="absolute inset-0 flex flex-col items-start -top-10 md:-top-0 justify-center">
                <div className="lg:w-[30%] w-full lg:mx-16 md:mx-8 grid gap-4 text-white">
                    <div className='flex flex-col md:gap-8 gap-6 md:px-4 px-2 py-3 md:py-3 shadow-white md:text-sm text-xs'>

                        <div className="grid gap-2">
                            <p className='xl:text-3xl md:text-2xl text-lg font-bold'>{carousels[currentIndex]?.titulo ? carousels[currentIndex]?.titulo : ""}</p>

                            <p className="line-clamp-3">{carousels[currentIndex]?.descricao ? carousels[currentIndex]?.descricao : ""}</p>
                        </div>

                        {/* <div
                            className='bg-white font-semibold text-xs cursor-pointer w-28 duration-300 lg:hover: hover:scale-105 cursor-pointerscale-105 px-6 md:py-3 py-2 rounded-sm text-black'
                        >
                            <p>Saber mais</p>
                        </div> */}

                    </div>
                </div>
            </div>

            <div>
                {/* Pontos do carrossel */}
                <div className="absolute hidden lg:flex-col gap-2 lg:flex lg:right-4 lg:top-1/2 transform -translate-y-1/2">
                    <div></div>
                    {carousels.map((_, index) => (
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
    )
}