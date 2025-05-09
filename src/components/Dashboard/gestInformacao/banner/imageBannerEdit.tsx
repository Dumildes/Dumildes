import { useState } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Avatar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingShort from "../../../load/loadingShort";
import { useAuth } from "../../../../contexts/AuthProvider";
import CNPApi from "../../../../services/CNPApi";

interface User {
  dadosPessoais?: {
    nome?: string;
    fotoURL?: string;
  };
  tipo?: string;
  funcao?: string;
  _id?: string;
}

interface EditBannerProps {
  bannerId: string;
  currentImage: string;
  setMessageSuccess: (message: string) => void;
  setMessageError: (message: string) => void;
  setForceUpdate: (data: any) => void;
}

const EditBanner = (props: EditBannerProps) => {
  const { bannerId, currentImage, setMessageSuccess, setMessageError, setForceUpdate } = props;
  const auth = useAuth();

  const defaultUser: User = {
    dadosPessoais: {
      nome: "",
      fotoURL: "",
    },
    tipo: "",
    funcao: "",
    _id: "",
  };

  const user: User = auth.user as User || defaultUser;
  
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = () => {
    if (!selectedFile) {
      setMessageError("Nenhuma imagem selecionada");
      return;
    }

    setOpen(true);
    setMessageSuccess("");
    setMessageError("");

    const formData = new FormData();
    formData.append("imagem", selectedFile);
    formData.append("carouselId", bannerId);
    formData.append("userId", user._id || "");

    CNPApi.patch("/carousel/change-imagem", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setOpen(false);
        setDialogOpen(false);
        setMessageSuccess("Imagem atualizada com sucesso.");
        setForceUpdate(response);
      })
      .catch((err) => {
        setOpen(false);
        setMessageError(err.response.data.message);
        console.error("Erro ao aterar imagem", err);
      });
  };

  return (
    <>
      <IconButton 
        title="Editar imagem" 
        onClick={handleOpenDialog} 
        color="primary"
      >
        <EditIcon />
      </IconButton>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Imagem do Slide</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, my: 2 }}>
            {!previewImage ? (
              // Show current image with upload overlay when no new image is selected
              <Box 
                sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  cursor: 'pointer'
                }}
                component="label"
              >
                <Avatar
                  src={currentImage}
                  style={{ width: '100%', height: 'auto', maxHeight: 300 }}
                  variant="square"
                  className="rounded-md"
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 60, color: 'white' }} />
                  <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
                    Clique para selecionar uma nova imagem
                  </Typography>
                </Box>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Box>
            ) : (
              // Show only the new image when selected
              <Box>
                <Avatar
                  src={previewImage}
                  style={{ width: '100%', height: 'auto', maxHeight: 300 }}
                  variant="square"
                  className="rounded-md"
                />
                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Selecionar outra imagem
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateImage} 
            color="primary" 
            variant="contained"
            disabled={!selectedFile || open}
          >
            {open ? <LoadingShort text="Atualizando..." /> : "Atualizar Imagem"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditBanner;