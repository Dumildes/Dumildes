/// <reference no-default-lib="true"/>
 
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import editBotao from "../assets/editar.svg";

export function ButtonEditar({ setEdit, edit, id }) {

  return (
    <>
      {edit ? (
        <IconButton
          onClick={() => {
            setEdit(false);
          }}
          size="small"
          title="Fechar"
          style={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => {
            setEdit(id ?? true);
          }}
          title="Editar"
        >
          <img src={editBotao} alt="" className="size-6  " />
        </IconButton>
      )}
    </>
  );
}
