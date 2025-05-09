import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="max-w-screen text-xs md:h-40 p-8 py-10 text-center md:py-0 text-gray-700 bg-gray-50 flex flex-col gap-4 justify-center items-center">
            <div>
            <Link to="/">
                    {/* <img
                        src="/cnplogo.svg"
                        alt="Logo da CNP"
                        width={120}
                        height={100}
                    /> */}

                </Link>

            </div>
            <p>
                Contactos: geral@cnp.ao | suport@cnp.ao | Rua 03, casa n 258, Bairro Nova Vida, Luanda - Angola
            </p>

            <div className="flex flex-col md:flex-row gap-1">
                <p className='text-xs'>CNP &copy; - {new Date().getFullYear()} Todos os direitos reservados | </p>
                <Link to="/politicas-e-servicos">Politicas de Privacidade</Link>
                <p>|</p>
                <Link to="/perguntas-frequentes">FAQs</Link>
            </div>
        </div>
    )
}