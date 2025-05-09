import { QRCodeSVG } from 'qrcode.react';

const AppStoreRedirect = () => {

  return (
    <div className='h-[100%] flex text-gray-800 flex-col gap-2 items-center lg:justify-center justify-center'>

      <div className="lg:flex hidden flex-col items-center justify-between gap-6 font-semibold ">
        <span className="text-xl">Instale o app CNP</span>

        <QRCodeSVG value="https://cnp-production-server.vamsolucoes.com/redirecionamento-para-download-app-cnp" size={130} />

        <p className="text-sm w-[60%] text-center max-w-md">
          Leia o código QR com a câmara do seu Smartphone para instalar o app CNP
        </p>

        <p>Ou escolha uma das opções:</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row mt-4">
        <a href="https://apps.apple.com/ao/app/cnp-carteira-digital/id6480178712"
          className="text-center hover:scale-105 hover:text-black grid gap-2 text-black font-semibold px-4 py-2 rounded mr-2">
          <img
            src="/AppStore.png"
            alt=""
            className="lg:h-10 h-12 object-cover shadow-md transition-shadow duration-300"
          />
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.cnpdigital.cnpao"
          className="text-center hover:scale-105 hover:text-black grid gap-2 text-black font-semibold px-4 py-2 rounded mr-2">
          <img
            src="/Androidapp.png"
            alt=""
            className="lg:h-10 h-12 object-cover shadow-md transition-shadow duration-300"
          />
        </a>
      </div>

    </div>
  );
};

export default AppStoreRedirect;