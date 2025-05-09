import { useState } from "react";
import { AiFillEye } from "react-icons/ai";

export default function AtuationArea() {
  const images = [
    "/cnp-engPetroleo.jpg",
    "/cnp-arquitecto.jpg",
    "/cnp-engCivil.jpg",
    "/cnp-infermeira.jpg",
    "/cnp-advogado.jpg", 
  ];

  // Seleciona aleatoriamente uma das 5 imagens ao carregar a página
  const [mainImage, setMainImage] = useState(
    images[Math.floor(Math.random() * images.length)]
  );

  return (
    <div className="flex flex-col justify-center items-center gap-8 px-2 lg:px-0">
      <div className="flex items-center justify-center pb-4 lg:pt-0 pt-10">
        <h1 className="lg:text-xl text-lg font-bold text-red-600 text-center">
          ÁREAS DE ATUAÇÃO
        </h1>
      </div>

      <div className="flex lg:flex-row flex-col justify-between w-full gap-2 h-full">
        {/* Imagem principal exibindo uma das 5 */}
        <div className="lg:w-full lg:h-full md:w-full h-full flex md:hidden xl:flex hidden items-center justify-center overflow-hidden">
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-full rounded-md object-cover object-center"
          />
        </div>

        {/* Mostra apenas as 4 primeiras imagens */}
        <div className="grid grid-cols-1 md:w-full lg:w-full xl:w-full gap-2 sm:grid-cols-2">
          {images.slice(0, 4).map((src, index) => (
            <div
              key={index}
              className="relative group lg:h-full md:w-full bg-red-50"
              onMouseEnter={() => setMainImage(src)}
            >
              <img
                src={src}
                alt={`thumb-${index}`}
                className="lg:w-full h-full rounded-md object-cover shadow-md transition-shadow duration-300"
              />
              <div className="absolute inset-0 xl:flex hidden items-center justify-center bg-orange-400 bg-opacity-90 cursor-zoom-in opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <AiFillEye size={32} color="white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
