import { Container } from "@mui/material";

export default function About() {

    return (
       <Container>
         <div className='grid xl:gap-32 md:gap-20 gap-10 text-sm lg:pt-10 h-full mt-16'>
            
            <div className="grid place-items-center md:grid-cols-2 lg:gap-20 md:gap-10 gap-6">

                <div className="flex flex-col md:gap-8 gap-4">
                    <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-600 font-bold">Sobre CNP</h1>

                    <div className="flex flex-col gap-4 text-sm">
                        <p>A CNP é o acrónimo de Carteira Nacional Profissional (Digital). Uma Plataforma que aloja as Ordens, cria uma base de dados legítima que é gerida remotamente pelas Ordens, e os membros têm acesso a nível global.</p>
                        <p>A Plataforma CNP com aplicativos móveis integrados, foi criado para atender às necessidades das Ordens que buscam soluções de gerenciamento mais avançadas dos membros inscritos que procuram maior aproximação com a classe da qual pertencem, e do Público em geral que ganha a possibilidade de certificar-se da legitimidade dos Profissionais que procuram de forma cómoda e segura.</p>
                    </div>
                </div>

                <img
                    src='/cnp-advo.svg'
                    alt=''
                    className="w-full xl:h-full rounded-md shadow-sm object-cover"
                />
            </div>

            <div className="grid gap-10">
                <h1 className="text-center text-lg md:text-xl lg:text-2xl font-semibold lg:pb-10 pt-4 md:pt-0 lg:font-bold">A Plataforma CNP oferece 3 módulos:</h1>

                <div className="flex flex-col md:flex-row xl:gap-10 gap-4 items-center xl:w-[56vw]">
                    <img
                        src='/cnp-infermeira.jpg'
                        alt=''
                        className="xl:w-full w-full h-full xl:h-[40vh] rounded-md shadow-sm object-cover"
                    />

                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-center lg:text-start"><span className="text-red-600 ">CNP</span> Gestor:</h1>

                        <p>Permite criar uma base de dados digital segura, inscrever, catalogar os membros, gestão remota, gestão de pagamento de quotas e permite o recrutamento por parte das empresas.</p>

                    </div>
                </div>

                <div className="flex flex-col-reverse ml-auto w-full md:flex-row md:gap-10 gap-4 items-center lg:w-[56vw]">

                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-center lg:text-start lg:ml-auto"><span className="text-red-600 ">CNP</span> Carteira Digital:</h1>
                        
                        <p className="lg:text-end">Permite aos membros, controlo de informações profissionais, ser recrutado dentro da Plataforma CNP, ser notificado sobre vagas de emprego, receber comunicados, fazer pagamento das suas quotas, atendimento directo com a Ordem ou Organizações via Chat, acesso a lista de membros da sua Ordem e pesquisa de membros nas outras Ordens;</p>
                    </div>

                    <img
                        src='/cnp-engCivil.jpg'
                        alt=''
                        className="xl:w-full w-full h-full xl:h-[40vh] rounded-md shadow-sm object-cover"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:gap-10 gap-4 items-center xl:w-[56vw]">
                    <img
                        src='/cnp-engPetroleo.jpg'
                        alt=''
                        className="xl:w-full w-full h-full xl:h-[40vh] rounded-md shadow-sm object-cover"
                    />

                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-center lg:text-start"><span className="text-red-600 ">CNP</span> Busca:</h1>

                        <p>Permite ao Público fazer consulta (pesquisa) de profissionais legítimos nas Ordens.
                            Para as Empresas e Entidades Públicas e Privadas, o aplicativo CNP Busca permite acesso e consulta de curriculum e recrutamento dos profissionais com apoio das Ordens e Anunciar diretamente para os profissionais da Ordem.</p>

                    </div>
                </div>
            </div>

            <div className="flex lg:flex-row flex-col lg:font-medium lg:text-lg text-white lg:py-12 xl:py-20 p-4 xl:px-24 px-4 py-8 md:py-8 md:px-12 lg:px-10 rounded-sm shadow-lg justify-between gap-14 lg:gap-6 bg-gradient-to-r from-red-600 to-orange-600">
                <p>A Plataforma CNP está disponível imediatamente para as Ordens e Organizações interessadas em melhorar os processos de gestão e legitimidade dos seus membros inscritos. A plataforma é altamente personalizável e pode ser adaptada para atender às necessidades específicas de cada Ordem e Organizações.</p>
            </div>
        </div>
       </Container>
    )
}