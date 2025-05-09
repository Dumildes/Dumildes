import { useState } from "react";
import Popup from "../../Popup";
import AppStoreRedirect from "../../AppStoreRedirect";

export default function AppInstall() {

  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false)
  };


  return (
    <div className="flex rounded-[5px] md:flex-row xl:flex-row flex-col md:h-[30vh] lg:h-[40vh] xl:h-[50vh] 2xl:h-[60vh] pt-10 lg:py-0 lg: my-10 h-full justify-between gap-14 lg:gap-2 xl:gap-6 bg-gradient-to-r from-red-600 to-orange-600 px-4 max-w-[100vw]">

      <div className="xl:w-[46%] flex flex-col justify-center gap-8 xl:gap-8 lg:px-8 text-white">

        <span className="xl:text-4xl text-2xl xl:w-[70%] font-semibold">
          Um Aplicativo, Duas Finalidades!
        </span>

        <p>
          A Plataforma CNP está disponível imediatamente para as Ordens e
          Organizações interessadas em melhorar os processos de gestão e
          legitimidade dos seus membros inscritos.
        </p>

        <div onClick={openPopup} className="lg:p-2 cursor-pointer duration-500 hover:scale-105 p-3 bg-white text-gray-700 font-semibold lg:w-32 rounded-sm text-center text-sm">
          <p>Instalar App</p>
        </div>

      </div>

      <div className="flex items-end lg:mx-20">

        <img
          src="/phone.svg"
          alt=""
          className="xl:h-[23rem] 2xl:h-[13rem] object-cover shadow-md transition-shadow duration-300"
        />

      </div>

      <Popup
        closePopup={closePopup}
        content={
            <AppStoreRedirect />
        }
        isOpen={isOpen}
      />

    </div>
  );
}
