import { Link } from "react-router-dom";

export default function Cards() {

    return (
        <div className='grid md:grid-cols-3 lg: pt-10  h-full items-center justify-between lg:gap-4 gap-10 mt-20'>

            <div className='flex items-center h-full lg:justify-between px-4 gap-8 border-red-500 border-l-2'>

                <img
                    src="/service.svg"
                    alt=""
                    className='lg:w-12 w-10'
                />
                
                <div className='flex flex-col justify-between h-full gap-4'>

                    <div className='grid gap-2 lg:text-xs text-xs'>
                        <p className='text-lg md:text-xl font-bold'>Serviços "Tailor Made"</p>
                        <p>A CNP tem como objectivo fornecer serviços de forma 100% customizado as necessidades do cliente.</p>
                    </div>

                </div>
            </div>

            <div className='flex items-center h-full lg:justify-between px-4 gap-8 border-red-500 border-l-2'>

                <img
                    src="/user.svg"
                    alt=""
                    className='lg:w-12 w-10'
                />

                <div className='flex flex-col justify-between h-full gap-4'>

                    <div className='grid gap-2 lg:text-xs text-xs'>
                        <p className='text-lg md:text-xl font-bold'>Sobre</p>
                        <p>A CNP é uma empresa de desenvolvimento de soluções. Fundada em 2018, a empresa tem como objectivo fornecer soluções práticas e inovadoras.</p>
                    </div>

                    <Link to="/sobre" className='bg-orange-500 mg:text-sm text-xs hover:text-white text-white font-medium w-24 p-2 lg:hover:scale-105 cursor-pointer rounded-sm text-center'>
                        <p>Saber mais</p>
                    </Link>
                </div>

            </div>

            <div className='flex items-center h-full lg:justify-between px-4 gap-8 border-red-500 border-l-2'>

                <img
                    src="/anuncio.svg"
                    alt=""
                    className='lg:w-12 w-10'
                />

                <div className='flex flex-col justify-between h-full gap-4'>

                    <div className='grid gap-2 lg:text-xs text-xs'>
                        <p className='text-lg md:text-xl font-bold'>Anúncios</p>
                        <p>Anuncie para vários profissionais, os seus produtos e serviços.</p>
                    </div>

                    <Link to="/anuncio" className='bg-orange-500 mg:text-sm text-xs hover:text-white text-white font-medium w-24 p-2 lg:hover:scale-105 cursor-pointer rounded-sm text-center'>
                        <p>Saber mais</p>
                    </Link>
                </div>

            </div>

        </div>
    )
}