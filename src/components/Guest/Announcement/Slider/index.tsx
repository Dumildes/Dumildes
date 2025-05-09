import { useInView } from "react-intersection-observer";
import { Announcement } from "../../../../pages/Guest/Announcement";

type SliderProps = {
  announcements: Announcement[];
  openPopup: (announcement: Announcement) => void;
};

export default function Slider({ announcements, openPopup }: SliderProps) {
  const { ref, inView } = useInView({
    triggerOnce: false, // Permitir reaparecer ao rolar novamente para cima
    threshold: 0.1,     // Apenas 10% visível para ativar a animação
  });

  // Dividir os anúncios em linhas com base no número de colunas
  const columnsPerRow = 3; // Ajuste conforme sua grade (3 colunas por linha)
  const rows = [];
  for (let i = 0; i < announcements.length; i += columnsPerRow) {
    rows.push(announcements.slice(i, i + columnsPerRow));
  }

  return (
    <div ref={ref} className="space-y-8">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 
            transition-opacity duration-[5000ms] ease-out transform
            ${inView ? `opacity-100 translate-y-0 delay-${rowIndex * 1000}` : "opacity-0 translate-y-40"}`}
          style={{
            transitionDelay: `${rowIndex * 2}s`, // Atraso de 2 segundo por linha
          }}
        >
          {row.map((announcement, index) => (
            <div
              key={index}
              className="relative shadow-xl bg-cover bg-center xl:h-[50vh] md:h-[26vh] h-[38vh] rounded-lg overflow-hidden transition-transform duration-[1500ms] ease-out"
              style={{
                backgroundImage: `url("${announcement.imagens[0]}")`,
              }}
            >
              <div className="absolute flex flex-col justify-between bottom-0 left-0 right-0 h-[60%] md:h-[50%] bg-white p-4 m-2 rounded-md text-sm">
                <div className="grid gap-2">
                  <h2 className="font-semibold">{announcement.titulo}</h2>
                  <p className="text-gray-700 line-clamp-2 xl:line-clamp-3 2xl:line-clamp-6">{announcement.descricao}</p>
                </div>
                <div
                  onClick={() => openPopup(announcement)}
                  className="bg-black text-xs text-white duration-500 cursor-pointer xl:hover:scale-105 lg:w-24 w-full md:p-2 p-2 text-center rounded-md"
                >
                  <p>Saber mais</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
