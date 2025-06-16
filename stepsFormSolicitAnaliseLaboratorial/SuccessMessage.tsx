import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Home } from '@mui/icons-material';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";


import { useNavigate } from 'react-router-dom';

interface Props {
  onClose?: () => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#85287E'
    }
  }
});

const SuccessMessage: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();

  // const handleGoToQualityControl = () => {
  //   navigate('/controle-de-qualidade');
  // };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          width: '100%'
        }}
      >
        <Card
          variant="outlined"
          sx={{
            maxWidth: 500,
            width: '100%',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}
        >
          <CardContent
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <CheckCircleOutlineIcon
              color="success"
              sx={{
                width: "60px",
                height: "60px",
                mb: 2,
                animation: 'bounce 0.5s ease-in-out',
                '@keyframes bounce': {
                  '0%': {
                    transform: 'scale(0)',
                    opacity: 0
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1
                  }
                }
              }}
            />

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
              Solicitação Enviada com Sucesso!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              A sua solicitação de análise laboratorial foi recebida e será processada em breve.
              Acompanhe o status através da página de Controle de Qualidade.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              {/* <Button
              variant="contained"
              color="primary"
              onClick={handleGoToQualityControl}
              startIcon={<Assessment />}
              sx={{
                minWidth: 200,
                py: 1.5
              }}
            >
              Controle de Qualidade
            </Button> */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                startIcon={<Home />}
                sx={{
                  minWidth: 200,
                  py: 1.5
                }}
              >
                Página Inicial
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default SuccessMessage;
