import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading/loading'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import logo_ordem from '../../../assets/logo_ordem.jpg'
import CNPApi from '../../../services/CNPApi';

interface Anuncio {
    _id: string;
    tipo: string;
    imagens: string[];
    status: string;
    titulo: string;
    descricao: string;
}

const AnuncioProduto: React.FC = () => {
    const navigate = useNavigate()

    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        CNPApi.get<{ anuncios: Anuncio[] }>('anuncios?&perPage=50')
            .then(res => {
                setLoading(false)
                setAnuncios(res.data.anuncios.filter(anuncio => anuncio.tipo === 'Produto'));
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
                            sx={{ maxWidth: 345 }} key={anuncio._id}>
                            <CardMedia
                                sx={{ height: 200, margin: 'auto' }}
                                className='imgCard'
                                title="green iguana"
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
                                <p className='verMais' onClick={() => {navigate(`/admin/anuncio/tratamento/${anuncio._id}`)}}>Ver mais</p>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>);
    }

    return (

        <div className='anuncio'>
            {renderContent()}
        </div>
    )
}

export default AnuncioProduto
