import React, { useState, useRef } from 'react'
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Loading from '../Loading/loading';
import { Button, Slide } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import CNPApi from '../../../services/CNPApi';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Ordem {
  _id: string;
  status: string;
  sigla: string;
  logoURL: string;
  nome: string;
  local: string;
  descricao: string;
  approved: boolean;
  prioridade: string;
  profissao: string;
  email: string;
  tel: string;
  municipio: string;
  provincia: string;
  URL: string;
  serverURL: string;
  assinaturaPR: string;
}

interface AssinaturaProps {
  ordem: Ordem;
  setOrdem: (ordem: Ordem) => void;
}

const Assinatura: React.FC<AssinaturaProps> = ({ ordem, setOrdem }) => {
  const assinaturaInput = useRef<HTMLInputElement | null>(null);

  const [assinaturaPreview, setAssinaturaPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [modalAssinatura, setModalAssinatura] = useState(false)
  const [assinaturaPr, setAssinaturaPr] = useState<File | null>(null)

  const changeAssinatura = () => {
    if (!assinaturaPr) return;

    setLoading(true)
    const formData = new FormData();
    formData.append('assinaturaPR', assinaturaPr);
    formData.append('ordemId', ordem._id);

    CNPApi.patch('/ordem/change-assinatura', formData)
      .then(res => {
        setLoading(false)
        setOrdem(res.data.ordem)
        // setMessageSuccess(res.data.msg)
      }).catch(() => {
        setLoading(false)
        // setMessageSuccess()
      })
  }

  return (
    <div className='assinatura'>
      <div className='assinatura-menu'>
        <h4>assinatura</h4>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-haspopup="true"
          onClick={() => setModalAssinatura(true)}
        >
          <MoreVertIcon />
        </IconButton>
      </div>
      <div className="assinaturaImg">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <img src={ordem.assinaturaPR} alt="Assinatura atual" width={300} />
          </div>
        )}
      </div>
      <Dialog
        open={modalAssinatura}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setModalAssinatura(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div style={{ alignItems: 'center', }} className='modalLogo'>
          <p>Alterar Assinatura</p>
          <div style={{ cursor: 'pointer' }} onClick={() => assinaturaInput.current?.click()}>
            <p> Click para Carregar uma assinatura</p>
            <img src={assinaturaPreview || ordem.assinaturaPR} alt="assinatura"
              style={{ height: '180px', width: '300px', margin: 'auto', paddingLeft: '30px' }}
            />
          </div>
          <input ref={assinaturaInput} type="file" name='logo' onChange={(e) => {
            if (e.target.files?.[0]) {
              setAssinaturaPr(e.target.files[0])
              setAssinaturaPreview(URL.createObjectURL(e.target.files[0]));
            }
          }} style={{ display: 'none' }} />
          <DialogActions>
            <Button onClick={() => setModalAssinatura(false)}>Cancelar</Button>
            <Button onClick={() => {
              changeAssinatura()
              setModalAssinatura(false)
            }} autoFocus>
              Alterar
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}

export default Assinatura 
