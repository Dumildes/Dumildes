import { FiSearch } from "react-icons/fi";

export default function NavSearch({ openPopup }) {

    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
            <div className="w-full max-w-2xl flex md:flex-row flex-col md:gap-0 gap-2 p-4 md:mx-10 mx-2 shadow-lg md:shadow-2xl md:rounded-sm rounded-md bg-white items-center justify-center md:px-10">

                <p className='md:w-44 text-center md:text-start md:text-xl font-bold'><span className='text-red-700'>CNP</span> Busca</p>

                <div
                    onClick={openPopup}
                    className="flex w-full p-2 border-2 rounded-md overflow-hidden"
                >
                    <div
                        className="w-full hover:scale-[101%] cursor-pointer flex items-center justify-between px-2 text-sm"
                    >
                        <p>Pesquise aqui...</p>

                        <div>
                            <FiSearch size={16} />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}