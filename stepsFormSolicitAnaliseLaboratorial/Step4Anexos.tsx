import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface Props {
  formData: {
    tipoRemetente: string;
    [key: string]: any;
  };
  anexos: {
    autorizacaoImportacao: File | null;
    certificadoImportacao: File | null;
    remetidoPorAnexoBi: File | null;
  };
  errors: Record<string, string>;
  handleFileChange: (name: string, file: File | null) => void;
  isUploading?: boolean;
}

const Step4Anexos: React.FC<Props> = ({ formData, anexos, errors, handleFileChange, isUploading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(fieldName, file);
  };

  const renderFileUpload = (fieldName: string, label: string) => {
    const file = anexos[fieldName as keyof typeof anexos];
    const error = errors[fieldName];

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Box
          sx={{
            border: '1px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <input
            accept="application/pdf"
            style={{ display: 'none' }}
            id={`upload-${fieldName}`}
            type="file"
            onChange={(e) => handleInputChange(e, fieldName)}
          />
          <label htmlFor={`upload-${fieldName}`}>
            <Button
              component="span"
              variant="outlined"
              startIcon={<CloudUpload />}
              disabled={isUploading}
              sx={{ mb: 1 }}
              color={error ? 'error' : 'primary'}
            >
              {isUploading ? (
                <CircularProgress size={24} />
              ) : (
                label
              )}
            </Button>
          </label>
          <Typography variant="caption" display="block" color={error ? 'error' : 'text.secondary'}>
            {file ? file.name : 'Nenhum arquivo selecionado'}
          </Typography>
          {error && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Anexar Documentos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Por favor, anexe os documentos em formato PDF
      </Typography>

      <Grid container spacing={3}>
        {renderFileUpload('remetidoPorAnexoBi', 'Anexar BI do Responsável')}
        
        {formData.tipoRemetente === 'Importador' && (
          <>
            {renderFileUpload('autorizacaoImportacao', 'Autorização de Importação')}
            {renderFileUpload('certificadoImportacao', 'Certificado de Importação')}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Step4Anexos;
