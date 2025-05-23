import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Paper,
  Theme
} from "@material-ui/core";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

// Definição de tipagem explícita para os estilos
const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    paper: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    gridItem: { 
      margin: theme.spacing(1)
    },
    justificativaField: { 
      minHeight: '150px'
    },
    title: {
      marginBottom: theme.spacing(2),
      fontWeight: 500
    },
    charCount: {
      textAlign: 'right',
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(0.5)
    }
  })
);

// Interface para os dados do formulário com comentários
interface JustificativaFormData {
  /** Texto da justificativa fornecida pelo usuário */
  justificativa: string;
}

// Interface para a action de Redux
interface JustificativaAction {
  type: string;
  payload: {
    dadosJustificativa: JustificativaFormData;
  };
}

/**
 * Componente StepJustificativa
 * Exibe um campo de texto para entrada da justificativa do usuário
 * e gerencia o estado enviando para o Redux
 */
const StepJustificativa: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState<JustificativaFormData>({
    justificativa: ''
  });

  /**
   * Manipula alterações nos campos do formulário
   * @param e - Evento de mudança do input
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envia os dados para o Redux store sempre que o formData mudar
  useEffect(() => {
    const action: JustificativaAction = {
      type: 'dadosJustificativa',
      payload: { dadosJustificativa: formData }
    };
    dispatch(action);
  }, [formData, dispatch]);

  return (
    <Box>
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h5" className={classes.title}>
          JUSTIFICATIVA
        </Typography>

        <Grid container>
          <Grid item xs={12} className={classes.gridItem}>
            <TextField
              required
              multiline
              rows={6}
              type="text"
              label="Por favor, escreva sua justificativa abaixo"
              placeholder="Descreva detalhadamente sua justificativa..."
              fullWidth
              name="justificativa"
              variant="outlined"
              onChange={handleChange}
              value={formData.justificativa}
              inputProps={{ className: classes.justificativaField }}
            //   error={formData.justificativa.trim() === ''}
            //   helperText={formData.justificativa.trim() === '' ? 'A justificativa é obrigatória' : ' '}
            />
            <Typography className={classes.charCount}>
              {formData.justificativa.length} caracteres
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StepJustificativa;