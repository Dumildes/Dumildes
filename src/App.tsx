import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Guest from './pages/Guest'
import Home from './pages/Guest/Home';
import About from './pages/Guest/About';
import Announcement from './pages/Guest/Announcement';
import Login from './pages/Guest/Login/login';
import AuthProvider from './contexts/AuthProvider';
import ForgetSenha from './pages/Guest/Login/forgetSenha';
import PrivateRoute from './hooks/privateRoute';
import Ordem from './components/Dashboard/Ordems/Ordem';
import OrdemDetalhe from './components/Dashboard/Ordems/OrdemDetalhe';
import RegistrarOrdem from './components/Dashboard/Ordems/RegistrarOrdem';
import RegisterAdminOrdem from './components/Dashboard/Ordems/registerAdminOrdem';
import AnuncioCriar from './components/Dashboard/anuncios/anuncioCriar';
import PublicRoute from './hooks/publicRoute';
import Anuncios from './components/Dashboard/anuncios/anuncios';
import Anunciantes from './components/Dashboard/anunciantes/anunciantes';
import AnuncianteTratamento from './components/Dashboard/anunciantes/anuncianteTratamento';
import TratamentoAnuncio from './components/Dashboard/anuncios/tratamentoAnuncio';
import Provincias from './components/Dashboard/provincias/provincias';
import AddProvincia from './components/Dashboard/provincias/addProvincia';
import Municipios from './components/Dashboard/provincias/municipios';
import TemplateAdmin from './components/Dashboard/Acoes/templateAdmin';
import Seguradoras from './components/Dashboard/ Seguradoras/seguradoras';
import GestBanner from './components/Dashboard/gestInformacao/banner';
import RegisterAdmin from './components/Dashboard/gestorAdmin/registerAdmin';
import ListaFuncionarios from './components/Dashboard/gestorAdmin/listaFuncionarios';
import Politics from './pages/Guest/Politics';
import Faqs from './pages/Guest/FAQs';

function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route path='/login' element={<Login />} />
            <Route path="/" element={<Guest />}>
              <Route index element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/anuncio" element={<Announcement />} />
              <Route path="/politicas-e-servicos" element={<Politics />} />
              <Route path="/perguntas-frequentes" element={<Faqs />} />
              <Route path='/redefinir/senha' element={<ForgetSenha />} />

              <Route path="/consulta-de-membro/:ordem" element={<Home />} />

            </Route>
          </Route>

          <Route element={<PrivateRoute />} >
            <Route path='admin' element={<TemplateAdmin element={<Ordem />} />} />
            <Route path='admin/ordem' element={<TemplateAdmin element={<Ordem />} />} />
            <Route path='admin/ordem/detalhe/:id' element={<TemplateAdmin element={<OrdemDetalhe />} />} />
            <Route path='admin/ordem/registrar' element={<TemplateAdmin element={<RegistrarOrdem />} />} />
            <Route path='admin/ordem/registrar/admin' element={<TemplateAdmin element={<RegisterAdminOrdem />} />} />
            <Route path='admin/ordem/editar/:id' element={<TemplateAdmin element={<RegistrarOrdem />} />} />

            <Route path='admin/anuncios' element={<TemplateAdmin element={<Anuncios />} />} />
            <Route path='admin/anuncio/tratamento/:id' element={<TemplateAdmin element={<TratamentoAnuncio />} />} />

            <Route path='/admin/anuncio/criar/:id' element={<TemplateAdmin element={<AnuncioCriar />} />} />
            <Route path='admin/anunciantes' element={<TemplateAdmin element={<Anunciantes />} />} />
            <Route path='admin/anunciante/tratamento/:id' element={<TemplateAdmin element={<AnuncianteTratamento />} />} />

            <Route path='admin/provincias' element={<TemplateAdmin element={<Provincias />} />} />
            <Route path='admin/create/provincia' element={<TemplateAdmin element={<AddProvincia />} />} />
            <Route path='admin/provincia/municipios/:id' element={<TemplateAdmin element={<Municipios />} />} />

            <Route path='admin/seguradoras' element={<TemplateAdmin element={<Seguradoras />} />} />

            <Route path='admin/gestor-banner' element={<TemplateAdmin element={<GestBanner />} />} />
            <Route path='admin/cadastrar-admin' element={<TemplateAdmin element={<RegisterAdmin />} />} />
            <Route path='admin/lista-de-administradores' element={<TemplateAdmin element={<ListaFuncionarios />} />} />


          </Route>
        </Routes>
      </AuthProvider>

    </BrowserRouter >
  )
}

export default App