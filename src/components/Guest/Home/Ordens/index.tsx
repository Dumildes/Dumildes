import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Phone, Mail, MapPin, LinkIcon } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

interface Ordem {
  _id: string;
  nome: string;
  email: string;
  tel: number;
  local: string;
  status: string;
  URL: string;
  logoURL: string;
}

interface ComponentParams {
  ordens: Ordem[];
  loading: boolean;
}

const SkeletonCard = () => (
  <div className="h-full bg-white border rounded-2xl p-6 shadow animate-pulse">
    <div className="flex justify-center">
      <div className="w-28 h-28 bg-gray-200 rounded-full" />
    </div>
    <div className="mt-6 mb-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-80 h-4 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  </div>
);

export default function Ordens({ ordens, loading }: ComponentParams) {
  
  const handleRedirect = (ordem: Ordem) => {
    if (ordem.status.toLowerCase() === 'activo') {
      window.open(ordem.URL, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-4 max-w-7xl mx-auto py-16">
        <div className="flex justify-center">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 max-w-full mx-auto py-12">
      <h1 className="text-2xl font-bold text-red-600 text-center">ORDENS</h1>

      {ordens?.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          grabCursor
          autoplay
          pagination={{ clickable: true, dynamicBullets: true }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
          className="w-full"
        >
          {ordens.map((ordem) => {
            const isActive = ordem.status.toLowerCase() === 'activo';
            return (
              <SwiperSlide key={ordem._id}>
                <div
                  onClick={() => handleRedirect(ordem)}
                  className={`group h-full p-5 rounded-2xl border transition-all duration-300 ${isActive
                    ? 'bg-white cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-100 opacity-40 cursor-not-allowed'
                    }`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={ordem.logoURL}
                        alt={`Logo ${ordem.nome}`}
                        className="w-[150px] h-[150px] object-contain rounded-full border border-gray-300 bg-white shadow-sm"
                      />
                      {isActive && (
                        <span className="absolute bottom-0 right-0 bg-green-600 text-white text-[10px] px-2 py-[2px] rounded-full shadow flex items-center gap-1 animate-pulse">
                          <LinkIcon className="h-4 w-4" />
                          Visitar
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{ordem.nome}</h2>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-left justify-left gap-2">
                        <Mail size={16} className="text-red-500" />
                        <span className="truncate">{ordem.email}</span>
                      </div>
                      <div className="flex items-left justify-left gap-2">
                        <Phone size={16} className="text-green-600" />
                        <span>{ordem.tel}</span>
                      </div>
                      <div className="flex items-left justify-left gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="truncate">{ordem.local}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

            );
          })}
        </Swiper>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900">
            Nenhuma ordem encontrada
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Não existem ordens cadastradas no momento.
          </p>
        </div>
      )}
    </div>
  );
}




/*

import { Ordem } from "../../../../pages/Guest/Home";
import { Phone, Mail, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Loading } from "../../../Loading";


type ComponentParams = {
    ordens: Ordem[],
    loading: boolean
}

export default function Ordens({ ordens, loading }: ComponentParams) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % ordens.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + ordens.length) % ordens.length);
    };
    
    if (loading) {
        return (
            <div className="flex  text-xs text-red-600 flex-col gap-4 items-center justify-center lg:py-12 py-4 px-4">
                <Loading size={40} />
                <p className="text-gray-500">Carregando as ordens...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 px-4 max-w-7xl lg:m-16 mx-2">
            <div className="flex items-center justify-center pb-4 lg:pt-0 pt-10">
                <h1 className="lg:text-xl text-lg font-bold text-red-600 text-center">ORDENS</h1>
            </div>

            {ordens?.length > 0 ? (
                <div className="relative xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid overflow-hidden w-full">
                    <div
                        className="flex xl:gap-4 md:gap-4 transition-transform duration-500"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {ordens.map((ordem) => (
                            <a
                                href={`${ordem.URL}`}
                                key={ordem._id}
                                className={`min-w-full md:px-1 lg:hover:bg-gray-50 duration-300 hover:shadow-lg ${ordem.status.toLocaleLowerCase() === 'activo' ? 'cursor-pointer border-red-500' : 'cursor-not-allowed opacity-20 border-gray-500'} bg-white border-y-2 shadow-md overflow-hidden`}
                            >
                                <div className="relative items-center flex justify-center">
                                    {ordem.logoURL && (
                                        <img
                                            src={ordem.logoURL}
                                            alt={`Logo ${ordem.nome}`}
                                            className="w-32 h-36"
                                        />
                                    )}

                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-sm font-semibold text-gray-800">{ordem.nome}</h2>
                                    </div>

                                    <div className="space-y-2 text-[10px] text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{ordem.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            <span>{ordem.tel}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{ordem.local}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={prevSlide}
                        className="absolute left-0 bottom-1/2 transform -translate-y-1/2 bg-gray-200 p-2 border border-black rounded-full shadow hover:bg-gray-200 hover:scale-105 duration-300"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 bottom-1/2 transform -translate-y-1/2 bg-gray-200 p-2 border border-black rounded-full shadow hover:bg-gray-200 hover:scale-105 duration-300"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma ordem encontrada</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Não existem ordens cadastradas no momento.
                        </p>
                    </div>
                </div>
            )
            }
        </div >
    );
}
*/