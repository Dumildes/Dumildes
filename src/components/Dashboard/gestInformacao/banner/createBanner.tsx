/// <reference no-default-lib="true"/>
/* eslint-disable */
import { Button, Paper, TextField, Typography, Box } from "@mui/material";
import { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Compressor from "compressorjs";
import ImageBannerEdit from "./imageBannerEdit";
import CNPApi from "../../../../services/CNPApi";
import LoadingBackdrop from "../../../load/loadingBackdrop";
import { useAuth } from "../../../../contexts/AuthProvider";

interface User { }

interface BannerData {
  titulo: string;
  descricao: string;
  imagem: File | null;
}

const CreateBanner = (props: any) => {
  const auth = useAuth();

  const defaultUser: User = {
    _id: '',
    dadosPessoais: {
      nome: '',
      fotoURL: ''
    },
    tipo: '',
    funcao: '',
  };

  const user: User = auth.user as User || defaultUser;
  // const [banner, setNoticia] = useState(props?.banner);
  const [banner, setNoticia] = useState<BannerData>({
    titulo: props?.banner?.titulo ?? "",
    descricao: props?.banner?.descricao ?? "",
    imagem: props?.banner?.imagem ?? null,
  });
  const [open, setOpen] = useState(false);
  const [Preview, setPreview] = useState(false);

  function HandleChange(e: any) {
    if (e.target.files) {
      const file = e.target.files[0];

      new Compressor(file, {
        quality: 0.6,
        // success(compressedFile) {
        //   // console.log(compressedFile)
        //   setNoticia({ ...banner, [e.target.name]: compressedFile });
        // }
        success(compressedFile) {
          const file = new File([compressedFile], e.target.files[0].name, {
            type: compressedFile.type,
          });
          // console.log("Arquivo comprimido final:", file);

          setNoticia({ ...banner, [e.target.name]: file });
        },
        error(err) {
          // console.log(err.message);
        },
      });
    } else {
      setNoticia({ ...banner, [e.target.name]: e.target.value });
    }
  }

  const HandleCreateBanner = () => {
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("titulo", banner?.titulo ?? "");
    formData.append("descricao", banner?.descricao ?? "");
    // formData.append("imagem", banner?.imagem);
    // if (banner?.imagem instanceof File) {
      //   formData.append("imagem", banner.imagem);
      // }
      
      formData.append("imagem", banner.imagem);
      // if (banner?.imagem instanceof File) {
      // } else {
      //   console.log("Imagem não é um arquivo válido:", banner?.imagem);
      // }
      // console.log("User ID:", user._id);

    formData.append("status", "Activo");

    for (const pair of formData.entries()) {
      // console.log("valor e : ", pair[0], pair[1]);
    }
    setOpen(true);
    props.seterrorMessage("");
    props.setMessage("");

    CNPApi.post('/carousel/create', formData)
      .then((res) => {
        setOpen(false);
        props.setMessage(res.data.msg);
        props.setCreateBanner(false);
      }).catch((error) => {
        console.log(error)

        props.seterrorMessage(error.response.data.message);
        setOpen(false);
      });

    // if (props?.banner) {
    //   await CNPApi.put("/carousel/edit", {
    //     ...banner,
    //     userId: user._id,
    //     bannerId: props.banner._id,
    //   })
    //     .then((res) => {
    //       setOpen(false);
    //       props.setMessage(res.data.msg);
    //       props.setEditarBanner(false);
    //     })
    //     .catch((error) => {
    //       setOpen(false);
    //     });
    // } else {
    //   await CNPApi.post("/carousel/create", formData)
    //     .then((res) => {
    //       setOpen(false);
    //       props.setMessage(res.data.msg);
    //       props.setCreateBanner(false);
    //     })
    //     .catch((error) => {
    //       console.log(error)

    //       props.seterrorMessage(error.response.data.message);
    //       setOpen(false);
    //     });
    // }
  }

  return (
    <>
      <LoadingBackdrop open={open} text={"A criar Banner. Aguarde!"} />

      {!Preview ? (
        <>
          <div>
            <Typography
              align="center"
              variant="subtitle1"
              style={{ fontSize: 20 }}
            >
              {props.title}
            </Typography>
            <br />

            {props?.banner ? (
              <ImageBannerEdit
                foto={props.banner.imagem}
                bannerId={props.banner._id}
                setEditarBanner={props.setEditarBanner}
              />
            ) : (
              <Paper
                style={{ border: "1px dashed #3e3d3f", position: "relative" }}
              >
                <label htmlFor="imagem" style={{ cursor: "pointer" }} >
                  {banner?.imagem ? (
                    <div>
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          position: "absolute",
                          padding: "3rem",
                        }}
                        sx={{
                          width: { xs: "90%", md: "60%" },
                          fontSize: { xs: "1.5rem", md: "2.5rem" },
                        }}
                      >
                        <p>
                          <strong> {banner?.titulo} </strong>
                          <br />
                          {banner?.descricao}
                        </p>
                      </Box>
                      <img
                        src={
                          props?.banner
                            ? props.banner.imagem
                            : URL.createObjectURL(banner.imagem)
                        }
                        alt="Imagem"
                        width="100%"
                        title="alterar imagem.."
                        className="h-96 object-contain"
                      />
                    </div>
                  ) : (
                    <Typography
                      align="center"
                      variant="body2"
                      style={{ padding: 20 }}
                    >
                      Imagem: 1000x650px - Resolução: 72px
                    </Typography>
                  )}
                  <input
                    accept="image/png, image/jpg, image/jpeg"
                    type="file"
                    name="imagem"
                    id="imagem"
                    style={{ display: "none" }}
                    onChange={HandleChange}
                  />
                </label>
              </Paper>
            )}

            <TextField
              margin="dense"
              type="text"
              label="Titulo"
              fullWidth
              size="small"
              name="titulo"
              variant="outlined"
              onChange={HandleChange}
              defaultValue={banner?.titulo}
            />

            <TextField
              margin="dense"
              type="text"
              label="Descrição"
              fullWidth
              size="small"
              name="descricao"
              variant="outlined"
              onChange={HandleChange}
              // defaultValue={banner?.subTitulo}
              defaultValue={banner?.descricao}
            />
            <br />
          </div>

          <div align="center">
            <br />
            <br />
            <Button
              color="error"
              style={{ marginRight: 10 }}
              variant="contained"
              onClick={() => {
                props.setCreateBanner(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={!banner?.imagem}
              style={{ backgroundColor: "#85287e", color: '#fff' }}
              variant="contained"
              onClick={HandleCreateBanner}
            >
              Salvar
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Typography variant="subtitle1" style={{ fontSize: 20, margin: 5 }}>
            <IconButton
              size="small"
              color="error"
              style={{ marginRight: 10 }}
              onClick={() => setPreview(false)}
            >
              <CloseIcon />
            </IconButton>
            Preview
          </Typography>
        </div>
      )}
    </>
  );
};

export default CreateBanner;
