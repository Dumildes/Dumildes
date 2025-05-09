/// <reference no-default-lib="true"/>
/* eslint-disable */
import React from "react";
import { Box, Divider, ListItemIcon } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LinkIcon from "@mui/icons-material/Link";
import { ButtonEditar } from "./ButtonEditar";
import { useAuth } from "../contexts/AuthProvider";

export function HeaderGestorConfigs(props) {
  const auth = useAuth();

  const defaultUser: User = {
      dadosPessoais: {
          nome: '',
          fotoURL: ''
      },
      tipo: '',
      funcao: '',
      _id: ''
  };

  const user: User = auth.user as User || defaultUser;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          style={{ fontSize: 20, flexGrow: 1 }}
          className="font-medium"
          // variant="h5"
        >
          {props.title}
        </Typography>

        <React.Fragment>
          {props.iconeEdit && (
            <ButtonEditar setEdit={props.setEdit} edit={props.edit} id={user._id} />
          )}
          
          {props.iconeAdd && (
            <Tooltip title="Adicionar local de trabalho">
              <IconButton onClick={() => props.setAdd(!props.add)}>
                <AddCircleOutlineOutlinedIcon color="secondary" />
              </IconButton>
            </Tooltip>
          )}

          {props.menu && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Mais opções">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {props.configArea === "fichaAdmin" && (
              <div>
                {props.editDados === false && (
                  <MenuItem
                    size="small"
                    onClick={() => props.setOpenEditFoto(true)}
                  >
                    {" "}
                    Editar Imagem{" "}
                  </MenuItem>
                )}
                <MenuItem
                  size="small"
                  onClick={() => props.setEditDados("senha")}
                >
                  {" "}
                  <ListItemIcon>
                    {" "}
                    <ModeEditIcon style={{color:"#E12025"}} />{" "}
                  </ListItemIcon>{" "}
                  Editar senha{" "}
                </MenuItem>
                <MenuItem
                  size="small"
                  onClick={() => props.setEditDados("dadosPessoais")}
                >
                  {" "}
                  <ListItemIcon>
                    {" "}
                    <ModeEditIcon style={{color:"#E12025"}} />{" "}
                  </ListItemIcon>{" "}
                  Editar dados pessoal{" "}
                </MenuItem>
                <MenuItem
                  size="small"
                  onClick={() =>
                    props.printQrCode(
                      props.dadosPessoalAdmin?.dadosPessoais?._id
                    )
                  }
                >
                  {" "}
                  <ListItemIcon>
                    {" "}
                    <PrintIcon style={{color:"#E12025"}} />{" "}
                  </ListItemIcon>{" "}
                  Imprimir QRCode{" "}
                </MenuItem>
              </div>
            )}

       
          </Menu>
        </React.Fragment>
      </div>

      <Divider style={{ marginBottom: 10 }} className="mt-4" />
    </>
  );
}
