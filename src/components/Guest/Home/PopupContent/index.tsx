import { FiX } from "react-icons/fi";
import { Member, Ordem } from "../../../../pages/Guest/Home";

// Definição da tipagem para `PopupContent`
interface PopupContentProps {
    loadingMember: boolean;
    members: Member[];
    itemSelected: Ordem | null;
    handleMemberRedirect: (member: Member) => void;
    setItemSelected: (item: Ordem | null) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setItemSearch: (value: string) => void;
    ordens: Ordem[];
    handleOnChange: (item: string) => void;
}

const MemberCardSkeleton = () => (
    <div className="flex max-w-[78vw] items-center shadow-md p-4 rounded-lg gap-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="min-w-0 w-full flex-1">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
        </div>
    </div>
);

export default function PopupContent({
    loadingMember,
    members,
    itemSelected,
    handleMemberRedirect,
    setItemSelected,
    handleSubmit,
    setItemSearch,
    ordens,
    handleOnChange
}: PopupContentProps) {

    return (
        <div className='flex flex-col items-center gap-8'>

            {((members?.length === 0 || members?.length > 1) || loadingMember) &&
                <img
                    src="/cnppesquisa.svg"
                    alt=""
                    className='lg:w-12 w-10'
                />
            }

            {loadingMember ?

                <div className="md:w-[90%] w-full md:max-h-[55vh] max-h-[65vh] overflow-y-auto transition-all duration-300 grid lg:grid-cols-2 gap-3 p-1 scrollbar scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100 ease-in-out">
                    {[...Array(members?.length || 10)].map((_, index) => (
                        <MemberCardSkeleton key={index} />
                    ))}
                </div>

                :

                <>
                    {members?.length > 0 && itemSelected ?
                        <>
                            {members?.length === 1 ?

                                <div className='md:w-[50%] w-full'>

                                    <div className="flex items-center justify-center">
                                        <img
                                            src={members[0].dadosPessoais.fotoURL}
                                            alt=""
                                            className='lg:h-[45vh] h-[50vh] w-[80%] md:w-[70%] rounded-md object-cover'
                                        />
                                    </div>

                                    <div className='flex flex-col text-sm items-center gap-2 py-2'>
                                        <p className='font-bold text-lg'>{members[0].nome}</p>
                                        <div className="text-center pb-2">
                                            <p>{members[0].perfil}</p>
                                            <p>Nº da Carteira: {members[0].numeroCarteira}</p>
                                            <p className='font-semibold'>{itemSelected.nome}</p>
                                        </div>
                                    </div>

                                    <div className={`p-2 text-center rounded-md text-white font-bold ${members[0].status === 'Activo' ? 'bg-[#7ebf42]' : 'bg-red-500'}`}>
                                        <p>{members[0].status}</p>
                                    </div>
                                </div>
                                :
                                <div className='md:w-[90%] w-full md:max-h-[55vh] max-h-[65vh] overflow-y-auto transition-all duration-300 grid lg:grid-cols-2 gap-3 p-1 
                                                        scrollbar scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-100 ease-in-out'
                                >
                                    {members.map((item, index) => (
                                        <div
                                            className='flex max-w-[78vw] items-center shadow-md p-4 hover:bg-gray-50 cursor-pointer rounded-lg gap-4'
                                            key={index}
                                            onClick={() => handleMemberRedirect(item)}
                                        >
                                            <img
                                                src={item.dadosPessoais.fotoURL}
                                                alt=""
                                                className='object-cover w-10 h-10 rounded-full flex-shrink-0' // adiciona flex-shrink-0
                                            />
                                            {/* Adiciona um container com largura fixa */}
                                            <div className='min-w-0 w-screen flex-1'> {/* min-w-0 previne que o flex cresça além do container */}
                                                <p className='truncate text-sm'>
                                                    {item.nome}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </>

                        :

                        <>

                            {itemSelected ?
                                <div className="w-full flex flex-col justify-center md:flex-row items-center md:gap-1 gap-3">
                                    {itemSelected && (
                                        <div className="text-xs flex items-center justify-center gap-2 bg-red-500 py-2.5 rounded-sm px-4 text-white font-semibold">
                                            <p>{itemSelected.nome}</p>
                                            <FiX
                                                onClick={() => setItemSelected(null)}
                                                className="cursor-pointer hover:scale-125 duration-300"
                                            />
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>

                                        <input
                                            className="md:w-[20vw] w-[80vw] px-3 py-2 border bg-white border-gray-200 rounded-sm text-sm"
                                            type="search"
                                            placeholder="Digite o número de carteira ou nome"
                                            onChange={(e) => setItemSearch(e.target.value)}
                                        />

                                        <input type="submit" value="" hidden />
                                    </form>
                                </div>

                                :

                                <select
                                    onChange={e => handleOnChange(e.target.value)}
                                    className='md:w-[60%] w-full p-2 border bg-white border-gray-400 rounded-md text-sm'
                                    defaultValue="" // Use defaultValue ao invés de selected
                                >
                                    <option value="">Selecione a profissão</option>
                                    {ordens?.length > 0 ?
                                        (
                                            ordens.map((ordem, index) => (
                                                (ordem.status === 'Activo' || ordem.status === 'Demo') && (
                                                    <option key={index} value={JSON.stringify(ordem)}>
                                                        {ordem.profissao}
                                                    </option>
                                                )
                                            ))
                                        )
                                        :
                                        null
                                    }
                                </select>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}