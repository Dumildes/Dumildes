import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardMedia, CardContent } from '@mui/material';
import logo_cnp from '../../../assets/cnplogo.svg'
import Loading from '../Loading/loading';
import CNPApi from '../../../services/CNPApi';

interface Anuncio {
    _id: string;
    imagens: string[];
    status: 'Activo' | 'Inactivo' | 'Suspenso' | string;
    titulo: string;
    descricao: string;
}

const AllAnuncio: React.FC = () => {
    const navigate = useNavigate()

    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true)
        CNPApi.get<{ anuncios: Anuncio[] }>('anuncios?&perPage=50')
            .then(res => {
                setLoading(false)
                setAnuncios(res.data.anuncios);
            }).catch(() => {
                setLoading(false)
            })
    }, [])

    const renderContent = () => {
        if (loading) {
            return <Loading />;
        }

        if (anuncios.length === 0) {
            return <p className="no-results">Não há anúncios disponíveis no momento.</p>;
        }

        return (
            <div className="anuncioCards">
                {
                    anuncios.map((anuncio) => (
                        <Card
                            className='card'
                            key={anuncio._id}>
                            <CardMedia
                                sx={{ height: 200, margin: 'auto' }}
                                className='imgCard'
                                title="Imagem anúncio"
                                image={anuncio.imagens[0]}
                            />
                            <CardContent>
                                <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    Estado:
                                    <span style={{
                                        width: '88px',
                                        padding: '4px',
                                        marginTop: '0',
                                        background: anuncio.status == 'Activo'
                                            ? 'rgba(124, 236, 54, 0.757)'
                                            : anuncio.status == 'Inactivo' ? '#E32D2D'
                                                : anuncio.status == 'Suspenso' ? '#00C2FE'
                                                    : '#FBAF1B'
                                    }}
                                        className='estado'>{anuncio.status}</span>
                                </p>
                                <p className='cardNome'>{anuncio.titulo}</p>
                                <p className='verMais' onClick={() => {
                                    navigate(`/admin/anuncio/tratamento/${anuncio._id}`)
                                }}>Ver mais</p>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        );
    }

    return (
        <div className='anuncio'>
            {renderContent()}
        </div>
    )
}

export default AllAnuncio
