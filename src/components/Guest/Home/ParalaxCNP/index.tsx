import { Container } from "@mui/material";

const ParalaxCNP = () => {
    return (
        <div className="h-[40vh] bg-fixed bg-center bg-cover bg-[url('/anuncios/anuncioOqueCNP.jpg')] flex items-center justify-center">
            <Container>
                <div className=" p-20 rounded-xl text-white max-w-2xl">
                    <h1 className="text-3xl font-bold mb-4">O que é CNP?</h1>
                    <p>
                        É o acrónimo de Carteira Nacional Profissional Digital. Uma Plataforma que aloja as Ordens, cria uma base de dados legítima que é gerida remotamente pelas Ordens, e os membros têm acesso a nível global.
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default ParalaxCNP