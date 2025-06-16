import { Box, Grid, Typography, Paper, FormControlLabel, Checkbox } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      padding: theme.spacing(2)
    },
    paper: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    mainTitle: {
      marginBottom: theme.spacing(3),
      fontWeight: 500
    },
    sectionTitle: {
      marginBottom: theme.spacing(2),
      fontWeight: 500
    },
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1)
    },
    checkboxRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(2)
    },
    charCount: {
      textAlign: 'right',
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(0.5)
    }
  })
);

interface FormData {
  evolucaoEfeitos: {
    riscoVida: boolean;
    hospitalizacao: boolean;
    malformacaoCongenita: boolean;
    recuperacaoComSequelas: boolean;
    recuperacaoSemSequelas: boolean;
    naoRecuperado: boolean;
    morte: boolean;
  };
  tratamentoCorretor: string;
  suspendeuMedicamento: 'sim' | 'nao' | '';
  diminuiuDose: 'sim' | 'nao' | '';
  efeitoDesapareceuSuspensao: 'sim' | 'nao' | 'naoSeAplica' | '';
  efeitoReapareceuReintroducao: 'sim' | 'nao' | 'naoSeAplica' | '';
}

export default function EvolucaoTratamento() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    evolucaoEfeitos: {
      riscoVida: false,
      hospitalizacao: false,
      malformacaoCongenita: false,
      recuperacaoComSequelas: false,
      recuperacaoSemSequelas: false,
      naoRecuperado: false,
      morte: false
    },
    tratamentoCorretor: '',
    suspendeuMedicamento: '',
    diminuiuDose: '',
    efeitoDesapareceuSuspensao: '',
    efeitoReapareceuReintroducao: ''
  });

  const handleCheckboxChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      evolucaoEfeitos: {
        ...prev.evolucaoEfeitos,
        [field]: e.target.checked
      }
    }));
  };

  const handleTratamentoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      tratamentoCorretor: e.target.value
    }));
  };

  const handleExclusiveChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof FormData] === value ? '' : value
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'evolucaoTratamento',
      payload: { evolucaoTratamento: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box className={classes.formContainer}>


      {/* Evolução dos Efeitos */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Evolução dos efeitos:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.checkboxGroup}>
              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.riscoVida}
                      onChange={handleCheckboxChange('riscoVida')}
                      color="primary"
                    />
                  }
                  label="Risco de vida"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.hospitalizacao}
                      onChange={handleCheckboxChange('hospitalizacao')}
                      color="primary"
                    />
                  }
                  label="Motivou Hospitalização"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.hospitalizacao}
                      onChange={handleCheckboxChange('hospitalizacao')}
                      color="primary"
                    />
                  }
                  label="Prolongou Hospitalização"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.malformacaoCongenita}
                      onChange={handleCheckboxChange('malformacaoCongenita')}
                      color="primary"
                    />
                  }
                  label="Malformação congênita"
                />
              </div>

              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.recuperacaoComSequelas}
                      onChange={handleCheckboxChange('recuperacaoComSequelas')}
                      color="primary"
                    />
                  }
                  label="Recuperação com sequelas"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.recuperacaoSemSequelas}
                      onChange={handleCheckboxChange('recuperacaoSemSequelas')}
                      color="primary"
                    />
                  }
                  label="Recuperação sem sequelas"
                />
              </div>

              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.naoRecuperado}
                      onChange={handleCheckboxChange('naoRecuperado')}
                      color="primary"
                    />
                  }
                  label="Não recuperou ainda"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.naoRecuperado}
                      onChange={handleCheckboxChange('naoRecuperado')}
                      color="primary"
                    />
                  }
                  label="Desconhecido"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.evolucaoEfeitos.morte}
                      onChange={handleCheckboxChange('morte')}
                      color="primary"
                    />
                  }
                  label="Morte"
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Tratamento Corretor */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Tratamento corretor
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              label="Tratamento corretor"
              placeholder="Descreva o tratamento aplicado para corrigir os efeitos..."
              fullWidth
              name="tratamentoCorretor"
              variant="outlined"
              onChange={handleTratamentoChange}
              value={formData.tratamentoCorretor}
            />
            <Typography className={classes.charCount}>
              {formData.tratamentoCorretor.length} caracteres
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Questões sobre Medicamento */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Informações sobre o medicamento
        </Typography>

        <Grid container spacing={3}>
          {/* Suspendeu medicamento */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Suspendeu medicamento?
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.suspendeuMedicamento === 'sim'}
                    onChange={() => handleExclusiveChange('suspendeuMedicamento', 'sim')}
                    color="primary"
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.suspendeuMedicamento === 'nao'}
                    onChange={() => handleExclusiveChange('suspendeuMedicamento', 'nao')}
                    color="primary"
                  />
                }
                label="Não"
              />
            </div>
          </Grid>

          {/* Diminuiu dose */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Diminuiu dose?
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.diminuiuDose === 'sim'}
                    onChange={() => handleExclusiveChange('diminuiuDose', 'sim')}
                    color="primary"
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.diminuiuDose === 'nao'}
                    onChange={() => handleExclusiveChange('diminuiuDose', 'nao')}
                    color="primary"
                  />
                }
                label="Não"
              />
            </div>
          </Grid>

          {/* Efeito desapareceu após suspensão */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Efeito desapareceu após suspensão?
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.efeitoDesapareceuSuspensao === 'sim'}
                    onChange={() => handleExclusiveChange('efeitoDesapareceuSuspensao', 'sim')}
                    color="primary"
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.efeitoDesapareceuSuspensao === 'nao'}
                    onChange={() => handleExclusiveChange('efeitoDesapareceuSuspensao', 'nao')}
                    color="primary"
                  />
                }
                label="Não"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.efeitoDesapareceuSuspensao === 'naoSeAplica'}
                    onChange={() => handleExclusiveChange('efeitoDesapareceuSuspensao', 'naoSeAplica')}
                    color="primary"
                  />
                }
                label="Não se aplica"
              />
            </div>
          </Grid>

          {/* Efeito reapareceu após reintrodução */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Efeito reapareceu após reintrodução?
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.efeitoReapareceuReintroducao === 'sim'}
                    onChange={() => handleExclusiveChange('efeitoReapareceuReintroducao', 'sim')}
                    color="primary"
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.efeitoReapareceuReintroducao === 'nao'}
                    onChange={() => handleExclusiveChange('efeitoReapareceuReintroducao', 'nao')}
                    color="primary"
                  />
                }
                label="Não"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.efeitoReapareceuReintroducao === 'naoSeAplica'}
                    onChange={() => handleExclusiveChange('efeitoReapareceuReintroducao', 'naoSeAplica')}
                    color="primary"
                  />
                }
                label="Não se aplica"
              />
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}