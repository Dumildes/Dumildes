import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './activarOrdem.css'
import Loading from '../Loading/loading';
import CNPApi from '../../../services/CNPApi';
import { LinkIcon, Mail, MapPin, Phone } from 'lucide-react';

interface Ordem {
  _id: string;
  status: string;
  logoURL: string;
  nome: string;
  local: string;
  descricao: string;
  email: string;
  tel: string;
}

const Ordem: React.FC = () => {
  const navigate = useNavigate();

  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'rgba(124, 236, 54, 0.757)';
      case 'Inactivo': return '#E32D2D';
      case 'Demo': return '#00C2FE';
      default: return '#FBAF1B';
    }
  };

  useEffect(() => {
    CNPApi.get<{ ordens: Ordem[] }>('ordems')
      .then(res => {
        setLoading(false)
        setOrdens(res.data.ordens);
      }).catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className='ordem'>
        {loading
          ? <div style={{ width: '500px', margin: 'auto' }}><Loading /></div>
          :
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            {ordens.map((ordem) => {
              const isActive = ordem.status.toLowerCase() === 'activo';
              return (
                <div
                  onClick={() => navigate(`/admin/ordem/detalhe/${ordem._id}`)}
                  className={`group h-full p-5 rounded-2xl border transition-all duration-300 ${isActive
                    ? 'bg-white cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-100 opacity-40 cursor-not-allowed'
                    }`}
                  style={{ width: '320px', minWidth: '20%' }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={ordem.logoURL}
                        alt={`Logo ${ordem.nome}`}
                        className="w-[150px] h-[150px] object-contain rounded-full border border-gray-300 bg-white shadow-sm"
                      />
                      {isActive && (
                        <span className="absolute bottom-0 right-0 bg-green-600 text-white text-[10px] px-2 py-[2px] rounded-full shadow flex items-center gap-1 animate-pulse">
                          <LinkIcon className="h-4 w-4" />
                          Visitar
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        width: '75px',
                        padding: '4px',
                        fontSize: '9pt',
                        marginTop: '0',
                        background: getStatusBackgroundColor(ordem.status),
                        cursor: 'default'
                      }} className='estado'> {ordem.status}</span></p>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{ordem.nome}</h2>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-left justify-left gap-2">
                        <Mail size={16} className="text-red-500" />
                        <span className="truncate">{ordem?.email}</span>
                      </div>
                      <div className="flex items-left justify-left gap-2">
                        <Phone size={16} className="text-green-600" />
                        <span>{ordem?.tel}</span>
                      </div>
                      <div className="flex items-left justify-left gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="truncate">{ordem.local}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  )
}

export default Ordem
