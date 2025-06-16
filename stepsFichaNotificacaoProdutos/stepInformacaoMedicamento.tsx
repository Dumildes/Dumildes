import {
  Box, Grid, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button
} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  gridItem: { margin: 8 },
  table: {
    minWidth: 1200,
  },
  tableContainer: {
    margin: 8,
    maxHeight: 600,
  },
  addButton: {
    margin: '16px 8px',
  },
  mainTitle: {
    margin: 15,
    fontWeight: 500,
    color: '#1976d2'
  },
  tableCell: {
    padding: '8px 4px',
    minWidth: 120
  },
  textField: {
    minWidth: 100,
    '& .MuiInputBase-input': {
      fontSize: '0.875rem'
    }
  }
});

interface MedicamentoData {
  nomeComercialDCI: string;
  apresentacao: string;
  doseDiaria: string;
  viaLocalAdministracao: string;
  dataToma: string;
  motivoTratamento: string;
  numeroLote: string;
  dataCaducidade: string;
  localCompra: string;
  inicioTratamento: string;
  terminoTratamento: string;
}

interface FormData {
  medicamentos: MedicamentoData[];
}

export default function InformacoesMedicamento() {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Inicializa uma tabela com 10 linhas vazias
  const initialMedicamentos = Array(10).fill(null).map((_, index) => ({
    nomeComercialDCI: '',
    apresentacao: '',
    doseDiaria: '',
    viaLocalAdministracao: '',
    dataToma: '',
    motivoTratamento: '',
    numeroLote: '',
    dataCaducidade: '',
    localCompra: '',
    inicioTratamento: '',
    terminoTratamento: ''
  }));

  const [formData, setFormData] = useState<FormData>({
    medicamentos: initialMedicamentos
  });

  // Função para adicionar mais uma linha na tabela
  const adicionarLinha = () => {
    setFormData({
      ...formData,
      medicamentos: [
        ...formData.medicamentos,
        {
          nomeComercialDCI: '',
          apresentacao: '',
          doseDiaria: '',
          viaLocalAdministracao: '',
          dataToma: '',
          motivoTratamento: '',
          numeroLote: '',
          dataCaducidade: '',
          localCompra: '',
          inicioTratamento: '',
          terminoTratamento: ''
        }
      ]
    });
  };

  const handleChange = (index: number, field: keyof MedicamentoData, value: string) => {
    const updatedMedicamentos = [...formData.medicamentos];
    updatedMedicamentos[index] = {
      ...updatedMedicamentos[index],
      [field]: value
    };

    setFormData({
      ...formData,
      medicamentos: updatedMedicamentos
    });
  };

  useEffect(() => {
    dispatch({
      type: 'informacoesMedicamento',
      payload: { informacoesMedicamento: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box>


      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} stickyHeader aria-label="tabela de medicamentos">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.tableCell}>N.º</TableCell>
              <TableCell align="center" className={classes.tableCell}>Nome comercial / DCI</TableCell>
              <TableCell align="center" className={classes.tableCell}>Apresentação</TableCell>
              <TableCell align="center" className={classes.tableCell}>Dose diária</TableCell>
              <TableCell align="center" className={classes.tableCell}>Via e local de administração</TableCell>
              {/* <TableCell align="center" className={classes.tableCell}>Data da toma</TableCell> */}
              <TableCell align="center" className={classes.tableCell}>Motivo do tratamento</TableCell>
              <TableCell align="center" className={classes.tableCell}>Número do lote</TableCell>
              <TableCell align="center" className={classes.tableCell}>Data de caducidade</TableCell>
              <TableCell align="center" className={classes.tableCell}>Local de compra</TableCell>
              <TableCell align="center" className={classes.tableCell}>Início do tratamento</TableCell>
              <TableCell align="center" className={classes.tableCell}>Término do tratamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.medicamentos.map((medicamento, index) => (
              <TableRow key={index}>
                <TableCell align="center" className={classes.tableCell}>
                  {index + 1}
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.nomeComercialDCI}
                    onChange={(e) => handleChange(index, 'nomeComercialDCI', e.target.value)}
                    placeholder="Nome/DCI"
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.apresentacao}
                    onChange={(e) => handleChange(index, 'apresentacao', e.target.value)}
                    placeholder="Apresentação"
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.doseDiaria}
                    onChange={(e) => handleChange(index, 'doseDiaria', e.target.value)}
                    placeholder="Dose/dia"
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.viaLocalAdministracao}
                    onChange={(e) => handleChange(index, 'viaLocalAdministracao', e.target.value)}
                    placeholder="Via/local"
                  />
                </TableCell>
                {/* <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    type="date"
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    value={medicamento.dataToma}
                    onChange={(e) => handleChange(index, 'dataToma', e.target.value)}
                  />
                </TableCell> */}
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.motivoTratamento}
                    onChange={(e) => handleChange(index, 'motivoTratamento', e.target.value)}
                    placeholder="Motivo"
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.numeroLote}
                    onChange={(e) => handleChange(index, 'numeroLote', e.target.value)}
                    placeholder="Nº lote"
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    type="date"
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    value={medicamento.dataCaducidade}
                    onChange={(e) => handleChange(index, 'dataCaducidade', e.target.value)}
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    value={medicamento.localCompra}
                    onChange={(e) => handleChange(index, 'localCompra', e.target.value)}
                    placeholder="Local compra"
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    type="date"
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    value={medicamento.inicioTratamento}
                    onChange={(e) => handleChange(index, 'inicioTratamento', e.target.value)}
                  />
                </TableCell>
                <TableCell align="center" className={classes.tableCell}>
                  <TextField
                    type="date"
                    size="small"
                    variant="outlined"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    value={medicamento.terminoTratamento}
                    onChange={(e) => handleChange(index, 'terminoTratamento', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        // style={{ background: '#85287e'}}
        variant="outlined"
        color="default"
        startIcon={<AddIcon />}
        onClick={adicionarLinha}
        className={classes.addButton}
      >
        Adicionar Medicamento
      </Button>
    </Box>
  );
}