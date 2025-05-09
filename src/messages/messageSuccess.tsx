/// <reference no-default-lib="true"/>
 
import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export default function MessageSuccess({ message }) {
    const [open, setOpen] = React.useState(true);

    setTimeout(() => {
        setOpen(false);
    }, 9000);

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
                {/* INPUT PARA DAR FOCO NO COMPONENTE ASSIM QUE FOR EXIBIDO */}
                <input autoFocus type="text" style={{ opacity: 0, height: 1 }} />
                <Alert
                    severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => { setOpen(false); }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
}