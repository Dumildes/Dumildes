/// <reference no-default-lib="true"/>

import { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import { Divider, Card, Container, DialogActions, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import DeleteBanner from "./deleteBanner";
import HeaderSession from "../../../../utils/headerSession";
import SwiperSlider from "./slider";
import Loading from "../../Loading/loading";
import MessageSuccess from "../../../../messages/messageSuccess";
import MessageError from "../../../../messages/messageError";
import Date from "../../../../utils/date";
import CreateBanner from "./createBanner";
import EditBanner from "./imageBannerEdit";
import CNPApi from "../../../../services/CNPApi";

export default function GestBanner() {
  const [title, setTitle] = useState("Criação");
  // const [editeBanner, setEditarNoticia] = useState(false);
  const [createBanner, setCreateBanner] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, seterrorMessage] = useState("");
  const [forceUpdate, setForceUpdate] = useState("");
  const [banners, setBanners] = useState('');

  useEffect(() => {
    CNPApi.get(`/carousels`)
      .then((response) => {
        // console.log(response);
        setBanners(response.data.carousels);
      })
      .catch(() => {
      });
  }, [createBanner, message, messageError]);

  const GridItem = ({ banner }) => {
    return (
      <div key={banner._id}>
        <Container>
          <Box>
            <Avatar
              src={banner.imagem}
              style={{ width: 300, height: 150 }}
              variant="square"
              className="rounded-md transition-all duration-1000 hover:opacity-70"
            />
          </Box>
  
          <Box className="m-2" style={{ position: "relative" }}>
            {banner?.titulo && (
              <Typography
                variant="subtitle1"
                style={{ lineHeight: 1, fontSize: 16, marginBottom: 5 }}
              >
                <strong>{banner.titulo} </strong>
              </Typography>
            )}
            {banner?.descricao && (
              <Typography
                variant="subtitle2"
                style={{
                  lineHeight: 1,
                  fontSize: 15,
                  marginBottom: 5,
                  maxWidth: "70vw",
                }}
              >
                <br />
                {banner.descricao}
              </Typography>
            )}
  
            <Typography
              variant="subtitle2"
              style={{ lineHeight: 1, fontSize: 12, marginBottom: 5, fontWeight: "bold" }}
            >
              Data: <Date date={banner.createdAt} />
              <br />
              criador: {banner.admin.nome}
            </Typography>
  
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                right: 0,
                top: 0,
              }}
            >
              {banner.status === "Inactivo" && (
                <small style={{ color: "red" }}> Não publicado</small>
              )}
  
              <EditBanner
                bannerId={banner._id}
                currentImage={banner.imagem}
                bannerData={banner}
                setMessageSuccess={setMessage}
                setMessageError={seterrorMessage}
                setForceUpdate={setForceUpdate}
              />

              <DeleteBanner
                bannerId={banner._id}
                setMessageSuccess={setMessage}
                setMessageError={seterrorMessage}
                setForceUpdate={setForceUpdate}
              />
              
            </div>
          </Box>
        </Container>
        <br />
        <Divider />
        <br />
      </div>
    );
  };

  return (
    <Container>
      <HeaderSession title={"GESTÃO DO BANNER"} />

      {message && <MessageSuccess message={message} />}
      {messageError && <MessageError message={messageError} />}

      <Card style={{ minHeight: "95vh", padding: 20 }}>
        {createBanner && (
          <CreateBanner
            title={title}
            setTitle={setTitle}
            setCreateBanner={setCreateBanner}
            setMessage={setMessage}
            seterrorMessage={seterrorMessage}
          />
        )}

        {banners.length > 0 && !createBanner && (
          <>
            <div>
              <SwiperSlider forceUpdate={forceUpdate} />

              <DialogActions>
                ADICIONAR NOVO SLIDER
                <IconButton
                  onClick={() => {
                    setCreateBanner(true);
                  }}
                >
                  <AddCircleOutlineIcon
                    style={{ fontSize: 30 }}
                    color="secondary"
                  />
                </IconButton>
              </DialogActions>
            </div>

            <Divider />
            <br />

            <Box className="m-2">
              {banners.map((banner) => (
                <GridItem key={banner._id} banner={banner} />
              ))}
            </Box>
          </>
        )}

        {!banners && (
          <DialogActions>
            ADICIONAR SLIDER
            <IconButton
              onClick={() => {
                setCreateBanner(true);
              }}
            >
              <AddCircleOutlineIcon
                style={{ fontSize: 30 }}
                color="secondary"
              />
            </IconButton>
          </DialogActions>
        )}

        {!banners && <Loading />}
      </Card>
    </Container>
  );
}
