import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Theme,
} from "@material-ui/core";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useDispatch } from 'react-redux';
import { Alert } from '@mui/material';
import api from '../../../../../services/api';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    paper: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    uploadButton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      minHeight: '60px',
      border: '2px dashed #ccc',
      '&:hover': {
        border: '2px dashed #85287e',
        backgroundColor: 'rgba(133, 40, 126, 0.04)'
      }
    },
    title: {
      marginBottom: theme.spacing(2),
      fontWeight: 500
    },
    fileList: {
      marginTop: theme.spacing(2)
    },
    fileItem: {
      border: '1px solid #e0e0e0',
      borderRadius: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: '#f9f9f9'
    },
    documentSection: {
      marginBottom: theme.spacing(3)
    },
    documentTitle: {
      marginBottom: theme.spacing(1),
      fontWeight: 500,
      color: '#85287e'
    },
    requiredText: {
      color: theme.palette.error.main,
      fontSize: '0.75rem'
    }
  })
);

interface DocumentoAnexado {
  id: string;
  nome: string;
  arquivo: File;
  tipo: 'documento1' | 'documento2' | 'documento3';
}

interface DocumentosFormData {
  documento1: DocumentoAnexado | null;
  documento2: DocumentoAnexado | null;
  documento3: DocumentoAnexado | null;
}

interface DocumentosAction {
  type: string;
  payload: {
    dadosDocumentos: DocumentosFormData;
  };
}

const StepDocumentos: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const [documentos, setDocumentos] = useState<DocumentosFormData>({
    documento1: null,
    documento2: null,
    documento3: null
  });

  const [erros, setErros] = useState<string[]>([]);

  const tiposDocumento = [
    {
      key: 'documento1' as const,
      titulo: 'BI',
      descricao: 'Cópia do documento de identidade ou passaporte'
    },
    {
      key: 'documento2' as const,
      titulo: 'Factura do Medicamento',
      descricao: 'Fatura do mMedicamento'
    },
    {
      key: 'documento3' as const,
      titulo: 'Copia da Inportação',
      descricao: 'Certificado da Inportação e Certificado de Inportação'
    }
  ];

  const validarArquivo = (arquivo: File): string | null => {
    // Verificar tamanho (máximo 5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
    if (arquivo.size > tamanhoMaximo) {
      return 'O arquivo deve ter no máximo 5MB';
    }

    // Verificar tipo de arquivo
    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!tiposPermitidos.includes(arquivo.type)) {
      return 'Tipo de arquivo não permitido. Use PDF, JPG, PNG ou DOC/DOCX';
    }

    return null;
  };

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>, 
    tipoDocumento: 'documento1' | 'documento2' | 'documento3'
  ) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const erro = validarArquivo(arquivo);
    if (erro) {
      setErros(prev => [...prev.filter(e => !e.includes(tipoDocumento)), erro]);
      return;
    }

    // Remover erros relacionados a este documento
    setErros(prev => prev.filter(e => !e.includes(tipoDocumento)));

    const novoDocumento: DocumentoAnexado = {
      id: Date.now().toString(),
      nome: arquivo.name,
      arquivo: arquivo,
      tipo: tipoDocumento
    };

    setDocumentos(prev => ({
      ...prev,
      [tipoDocumento]: novoDocumento
    }));

    // Limpar o input
    event.target.value = '';
  };

  const handleRemoveFile = (tipoDocumento: 'documento1' | 'documento2' | 'documento3') => {
    setDocumentos(prev => ({
      ...prev,
      [tipoDocumento]: null
    }));
  };

  const formatarTamanhoArquivo = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const action: DocumentosAction = {
      type: 'dadosDocumentos',
      payload: { dadosDocumentos: documentos }
    };
    dispatch(action);
  }, [documentos, dispatch]);

  return (
    <Box>
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h5" className={classes.title}>
          ANEXAR DOCUMENTOS
        </Typography>

        <Typography variant="body2" color="textSecondary" paragraph>
          Por favor, anexe os 3 documentos obrigatórios abaixo. 
          Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máximo 5MB cada).
        </Typography>

        {erros.length > 0 && (
          <Alert severity="error" style={{ marginBottom: 16 }}>
            {erros.map((erro, index) => (
              <div key={index}>{erro}</div>
            ))}
          </Alert>
        )}

        {tiposDocumento.map((tipo) => (
          <Box key={tipo.key} className={classes.documentSection}>
            <Typography variant="h6" className={classes.documentTitle}>
              {tipo.titulo} *
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {tipo.descricao}
            </Typography>

            {!documentos[tipo.key] ? (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                className={classes.uploadButton}
                startIcon={<CloudUploadIcon />}
              >
                Clique para anexar {tipo.titulo.toLowerCase()}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, tipo.key)}
                />
              </Button>
            ) : (
              <Paper className={classes.fileItem} elevation={1}>
                <ListItem>
                  <AttachFileIcon color="primary" style={{ marginRight: 8 }} />
                  <ListItemText
                    primary={documentos[tipo.key]!.nome}
                    secondary={formatarTamanhoArquivo(documentos[tipo.key]!.arquivo.size)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveFile(tipo.key)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            )}
          </Box>
        ))}

        <Alert severity="info" style={{ marginTop: 16 }}>
          <strong>Importante:</strong> Certifique-se de que todos os documentos estão legíveis 
          e contêm as informações necessárias antes de prosseguir.
        </Alert>
      </Paper>
    </Box>
  );
};

export default StepDocumentos;