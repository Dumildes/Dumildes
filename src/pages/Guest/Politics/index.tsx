import { Typography, Container, Paper } from '@mui/material';

const Politcs = () => {
  return (
    <Container maxWidth="md" sx={{ pt: 20 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, gap: 8 }}>
        <Typography variant="h4" textAlign={"center"} gutterBottom>
          Política de privacidade
        </Typography>

        <Typography paragraph textAlign={'justify'}>
          Pelo presente instrumento a Carteira Nacional Profissional divulga a sua Política de Privacidade e os seus Termos de Uso, assegurando a integridade e a segurança das informações pessoais identificáveis de seus usuários e colaboradores.
        </Typography>

        <Typography paragraph textAlign={'justify'}>
          O usuário pode navegar pela Plataforma sem a necessidade de fornecer as suas informações pessoais, mas o seu acesso implica na concordância com as regras de uso e de privacidade fixadas no presente termo.
        </Typography>

        <Typography paragraph textAlign={'justify'}>
          Para os serviços restritos, no entanto, poderá haver a requisição de dados do usuário. Neste caso, a Carteira Nacional Profissional assegura o armazenamento das informações de maneira sigilosa, não as compartilhando com terceiros sem prévia autorização, exceto quando solicitado por autoridade judicial.
        </Typography>

        <Typography paragraph textAlign={'justify'}>
          Os conteúdos de terceiros ou as notícias produzidas pelos veículos de comunicação, reproduzidos na Plataforma CNP, são publicados mediante a autorização expressa dos seus envolvidos. As informações contidas neste site são protegidas pela Lei de Direitos Autorais, por isso, é expressamente vedada à sua utilização para o envio, distribuição, publicação ou divulgação sem a autorização da Carteira Nacional Profissional. A reprodução indevida sujeita o infrator às penalidades previstas em lei.
        </Typography>

        <Typography paragraph textAlign={'justify'}>
          Com a aceitação do presente termo, o usuário compromete-se a utilizar adequadamente as informações disponibilizadas, sujeitando-se à legislação vigente.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Politcs;
