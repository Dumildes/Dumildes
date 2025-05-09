/// <reference no-default-lib="true"/>
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box, Skeleton } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { makeStyles } from '@mui/styles'
import CNPApi from '../../../../services/CNPApi';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    justifyItems: 'center',
  },
}))

interface Banner{
  item:{
    imagem: string;
    descricao: string;
    titulo: string;
    _id: string;
  }
}

const SwiperSlider = ({ forceUpdate = false }) => {
  const classes = useStyles();
  const [banners, setBanners] = useState<Banner | String>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    CNPApi.get(`/carousels`)
      .then(response => {
        // console.log(response);
        setBanners(response.data.carousels);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
  }, []);


  return (
    <div className={classes.root} style={{ marginTop: forceUpdate ? 0 : 60 }}>

      {/* CONSULTOR DE PROCESSOS */}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="64vh">
          <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
        </Box>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}

        >
          {banners.map((item) => (
            <SwiperSlide key={item._id}>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  position: 'absolute',
                  padding: '3rem'
                }}
                sx={{
                  width: { xs: '90%', md: '60%' },
                  fontSize: { xs: '1.5rem', md: '2.5rem' }
                }}
              >
                <p>
                  <strong>{item.titulo}</strong>
                  <br />
                  {item.descricao}
                </p>
              </Box>
              <img
                src={item.imagem}
                alt="slider"
                className='slide-item'
                style={{
                  height: '64vh',
                  objectFit: 'cover',
                  // objectFit:'contain',  
                  objectPosition: 'center',
                  width: '100%'
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default SwiperSlider;
