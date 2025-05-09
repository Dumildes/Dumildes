import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import Popup from '../Popup';
import AppStoreRedirect from '../AppStoreRedirect';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
    const [toggle, setToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const isActive = (path: string) => location.pathname === path;
    const borderColor = scrolled ? 'border-[#000]' : 'border-white';
    const menuIconColor = 'text-black';

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    const linkStyle = (path: string) =>
        `pb-1 border-b-2 transition-all duration-300 ${
            isActive(path)
                ? 'text-red-600 border-red-600 hover:text-red-600 hover:border-red-600'
                : 'text-black border-transparent hover:text-black hover:border-red-600'
        }`;
    

    return (
        <div className='fixed top-0 border-b w-full bg-white z-50 transition duration-300 py-1'>
            <div className='lg:mx-20 md:mx-10 flex justify-between items-center p-4'>
                <Link to="/">
                    <img src="/cnplogo.svg" alt="Logo da CNP" width={0} height={0} className="w-[120px] h-10" />
                </Link>

                <div className='hidden lg:flex items-center justify-center gap-5 text-sm'>
                    <Link to="/" className={linkStyle('/')}>Início</Link>
                    <Link to="/sobre" className={linkStyle('/sobre')}>Sobre</Link>
                    <Link to="/anuncio" className={linkStyle('/anuncio')}>Anúncio</Link>

                    <span
                        onClick={openPopup}
                        className='bg-red-600 py-2 px-4 font-semibold hover:scale-105 duration-500 cursor-pointer rounded-md text-white'
                    >
                        Instalar App
                    </span>
                </div>

                <div className={`border p-2 rounded-lg ${borderColor} lg:hidden`}>
                    {toggle ? (
                        <AiOutlineClose onClick={() => setToggle(!toggle)} size={22} className={`lg:hidden block ${menuIconColor}`} />
                    ) : (
                        <FiMenu onClick={() => setToggle(!toggle)} size={22} className={`lg:hidden block ${menuIconColor}`} />
                    )}
                </div>
            </div>

            <div className={`duration-700 lg:hidden flex flex-col w-[100%] md:w-[30%] h-full md:h-[84vh] fixed gap-6 
                text-white text-xs font-semibold ${toggle ? `right-[0%] md:mr-2 md:mt-3` : `right-[-100%] md:right-[-90%]`}`}
                style={{ backgroundColor: '#000' }}
            >
                <p></p>
                <Link to="/"><span className='text-white mt-20 p-5'>Início</span></Link>
                <Link to="/sobre"><span className='text-white p-5'>Sobre</span></Link>
                <Link to="/anuncio"><span className='text-white p-5'>Anúncio</span></Link>
                <span onClick={openPopup}><span className='text-white p-5'>Instalar App</span></span>
            </div>

            <Popup
                closePopup={closePopup}
                content={<div className='flex h-full flex-col items-center gap-8'><AppStoreRedirect /></div>}
                isOpen={isOpen}
            />
        </div>
    );
};

export default Header;
