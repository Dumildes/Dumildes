/// <reference no-default-lib="true"/>
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export  function MessageState() {
    const dispatch = useDispatch()
    const alert = useSelector(state => state.alert.data);
    const refreshPage = useSelector(state => state.refresh.data);
    const [open, setOpen] = useState(alert ?? refreshPage);

    useEffect(() => {
        setOpen(alert ?? refreshPage)

        // PARA MENSAGENS DE NO STATE
        setTimeout(() => {
            dispatch({
                type: 'alert',
                payload: { alert: null },
            });

        }, 12000);

        // PARA REFRESH NO STATE
        setTimeout(() => {
            dispatch({
                type: 'refresh',
                payload: { refresh: null },
            });
        }, 1000);

    }, [alert, refreshPage])

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="error"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar
            open={!!open}
            autoHideDuration={10000}
            onClose={handleClose}
            message={alert ?? refreshPage}
            action={action}
        />
    );
}

