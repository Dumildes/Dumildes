export default function Notes() {

  const notes = [
    {
      id: 1,
      image: '/img_note1.jpeg',
      role: 'Estudante Universitária',
      name: 'Djamila Antunes',
      comment: '"A plataforma CNP tornou tudo tão simples e transparente. Fico feliz, é gratificante ver o quanto pode ajudar!"'
    },
    {
      id: 2,
      image: '/img_note2.jpeg',
      role: 'Anónimo',
      name: 'Genivaldo José',
      comment: '"A plataforma facilita a conexão entre membro e organizações, tornando a interação mais acessível e gratificante."'
    },
    {
      id: 3,
      image: '/img_note3.jpeg',
      role: 'Dona de casa',
      name: 'Ana Mária',
      comment: '"Buscar informações confiáveis sobre um profissional nunca foi tão fácil. A plataforma CNP agora é meu recurso essencial para me manter esclarecida e prevenida."'
    },
    {
      id: 4,
      image: '/img_note4.jpeg',
      role: 'Anónimo',
      name: 'Jonilson Miguel',
      comment: '"A CNP é uma ferramenta poderosa para impulsionar mudanças e defender a classe dos profissionais."'
    },
  ]

  return (
    <div className="flex flex-col gap-6 lg:px-0 sm:w-full lg:w-full 2xl:w-full">
      <div className="flex items-center justify-center pb-4 md:pt-10">
        <h1 className="lg:text-xl text-lg font-bold text-red-600 text-center">
          NOTAS
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
  {notes.map((note, index) => (
    <div key={index} className="flex items-center gap-4 rounded-md shadow-md bg-gray-50 py-4 px-4 text-sm min-h-[200px]">
      <div className="flex flex-col items-center justify-start gap-4 w-16">
        <img
          src={note.image}
          alt={note.name}
          className="w-12 h-12 object-cover rounded-full shadow-2xl"
        />
        <img
          src="/chat.svg"
          alt="Chat Icon"
          className="w-5 h-5"
        />
      </div>
      <div className="flex flex-col justify-between gap-3 flex-1">
        <div>
          <span className="font-semibold text-base">{note.name}</span>
          <h2 className="text-xs text-gray-600">{note.role}</h2>
        </div>
        <p className="text-xs">{note.comment}</p>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
