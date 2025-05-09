import { Announcement } from "../../../../pages/Guest/Announcement";
import returnDate from "../../../ReturnDate";

type ContentPopupProps = {
    contentPopup: Announcement
}

export default function ContentPopup({ contentPopup }: ContentPopupProps) {

    // console.log(contentPopup)

    return (



        <div className="grid overflow-y-auto lg:overflow-y-hidden lg:grid-cols-2 grid-cols-1 place-items-center w-full px-1 md:gap-8 gap-4 h-full">
            {/* Imagem com comportamento responsivo */}
            <div className="lg:h-96 h-60 w-full flex justify-center">
                <img
                    src={contentPopup.imagens[0]}
                    alt=""
                    className="object-cover lg:h-full h-auto w-[80vw] lg:w-full rounded-md"
                />
            </div>

            {/* Conteúdo com scroll para telas grandes */}
            <div className="flex flex-col gap-4 w-full lg:h-96 h-auto">
                <div className="flex flex-col gap-4">
                    <p className="md:text-sm text-xs">Publicado aos: <span className="font-semibold">{returnDate(contentPopup.createdAt)}</span></p>

                    <div className="">
                        <p className="text-red-600 text-xs">Título do Anúncio</p>
                        <p className="text-xl font-semibold">{contentPopup.titulo}</p>
                    </div>
                    <p className="text-gray-700 md:text-sm text-xs">Tipo de anúncio: <span className="font-bold">{contentPopup.tipo}</span></p>
                </div>

                <div className="grid gap-1">
                    <h2 className="font-semibold">Contactos do anunciante:</h2>

                    <p className="text-xs"><strong>Telefone:</strong> {contentPopup.anunciante.tel}</p>
                    <p className="text-xs"><strong>Email:</strong> {contentPopup.anunciante.email}</p>
                </div>

                <div
                    className="overflow-y-auto pr-2 h-auto transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100"
                >
                    <h1 className="font-semibold md:text-base pb-2">Descrição</h1>

                    <p className="text-gray-600 text-sm">{contentPopup.descricao}</p>
                </div>
            </div>
        </div>
    )
}