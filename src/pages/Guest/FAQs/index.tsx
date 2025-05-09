import React, { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Container,
    Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const sections = [
    {
        title: "A Carteira Nacional Profissional compartilha meus dados com terceiros?",
        content:
            "Não. As informações dos usuários são armazenadas de forma sigilosa e não são compartilhadas com terceiros sem autorização prévia, exceto quando exigido por autoridade judicial."
    },
    {
        title: "Preciso fornecer meus dados pessoais para navegar na plataforma?",
        content:
            "Não é necessário fornecer dados pessoais para navegar livremente. No entanto, o acesso à plataforma implica concordância com os termos de uso e privacidade."
    },
    {
        title: "Quando meus dados podem ser solicitados?",
        content:
            "Apenas para acesso a serviços restritos, seus dados podem ser solicitados. Nesses casos, a CNP assegura armazenamento seguro e confidencial."
    },
    {
        title: "Posso copiar e divulgar os conteúdos do site?",
        content:
            "Não. O conteúdo está protegido pela Lei de Direitos Autorais, e sua reprodução, publicação ou distribuição sem autorização é proibida por lei."
    },
    {
        title: "O que acontece ao aceitar os termos de uso?",
        content:
            "Ao aceitar os termos, o usuário se compromete a utilizar as informações de forma adequada, obedecendo à legislação vigente."
    }
];


const FaqStyled: React.FC = () => {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (
        _: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="md" sx={{ pt: 20 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 500 }}>
                Perguntas e Respostas <Box component="span" sx={{ color: "red" }}>Frequentes</Box>
            </Typography>

            <Box sx={{ mt: 5 }}>
                {sections.map((section, idx) => {
                    const panelId = `panel-${idx}`;
                    return (
                        <Accordion
                            key={panelId}
                            expanded={expanded === panelId}
                            onChange={handleChange(panelId)}
                            disableGutters
                            elevation={0}
                            square
                            sx={{
                                mb: 2,
                                borderRadius: "16px",
                                backgroundColor: "#fff",
                                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.05)",
                                "&::before": { display: "none" }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    outline: "none",
                                    px: 3,
                                    py: 2,
                                    "& .MuiAccordionSummary-content": { margin: 0 }
                                }}
                            >
                                <Typography sx={{ fontWeight: 500, color: "#0a1f33" }}>
                                    {section.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, py: 2 }}>
                                <Typography sx={{ color: "#4a4a4a" }}>
                                    {section.content}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </Container>
    );
};

export default FaqStyled;
