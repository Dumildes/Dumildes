/// <reference no-default-lib="true"/>
 
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingBackdrop(props) {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.open}
        >
            <CircularProgress thickness={4} />

            <p style={{ marginLeft: 10, color: '#fff' }} className='text-xl font-medium' >
                {props.text ?? 'Os dados estão sendo enviados... Por favor aguarda'}
            </p>
        </Backdrop>
    )
}

