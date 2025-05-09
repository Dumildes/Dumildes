import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { LayoutGrid, BarChart2, GitBranch, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../Nav/Navbar';

const Sidebar: React.FC = () => {

    const [isOrdemOpen, setIsOrdemOpen] = useState(false);
    const [isAnuncioOpen, setAnuncioOpen] = useState(false);

    return (
        <div style={{ display: 'flex', }} className='layout-container'>
            <div className="sidebar">
            <div className='img-logo'>
                <img src="/iconesCNP/logoCNP.svg" alt="" />
            </div>
                <nav>
                    <div className="nav-section">
                        <h2 className="nav-title">Menu</h2>
                        <ul className="nav-list">
                            <li className="nav-item">
                                <button onClick={() => setIsOrdemOpen(!isOrdemOpen)} className="nav-button">
                                    <BarChart2 className="nav-icon" size={20} />
                                    Ordens
                                    {isOrdemOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <ul className={`submenu ${isOrdemOpen ? 'open' : ''}`}>

                                    <li>
                                        <Link to="/admin/ordem"><span className='submenu-button'>Activar Ordem</span></Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/ordem/registrar"><span className='submenu-button'>Registrar Ordem</span></Link>
                                    </li>
                                    <li >
                                        <Link to="/admin/ordem/registrar/admin" ><span className='submenu-button'>Registrar Admin</span></Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <button onClick={() => setAnuncioOpen(!isAnuncioOpen)} className="nav-button">
                                    <GitBranch className="nav-icon" size={20} />
                                    Anúncios
                                    {isAnuncioOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <ul className={`submenu ${isAnuncioOpen ? 'open' : ''}`}>
                                    <li>
                                        <Link to="/admin/anuncios"><span className='submenu-button'>Ver Anúncios</span></Link>
                                    </li>
                                    <li >
                                        <Link to="/admin/anuncio/criar"><span className='submenu-button'>Criar Anúncios</span></Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/anunciantes"><span className='submenu-button'>Anúnciantes</span></Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <button className="nav-button">
                                    <LayoutGrid className="nav-icon" size={20} />
                                    <Link to="/admin/provincias" className="" style={{ textDecoration: 'none', color: '#fff', fontWeight: '390', fontSize: '12pt' }}>Províncias/Municípios</Link>
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div style={{ marginLeft: '250px', display:'flex', flexDirection:'column' }} className='principal-content'>
                <Navbar titulo=''/>
            </div>
        </div>
    )
}

export default Sidebar
