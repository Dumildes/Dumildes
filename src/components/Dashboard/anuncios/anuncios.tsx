import React, { useState, ReactNode } from 'react'
import './anuncios.css'
import PropTypes from 'prop-types';
import { useTheme, Tabs, Tab, Box } from '@mui/material';
import AnuncioVaga from './anuncioVaga';
import AnuncioProduto from './anuncioProduto';
import AnuncioServico from './anuncioServicos';
import AnuncioEvento from './anuncioEvento'
import AllAnuncio from './allAnuncio';


interface TabPanelProps {
    children?: ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};



const Anuncios = () => {
    const theme = useTheme();

    const [value, setValue] = useState(0);
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <div className='anuncio'>
                <Box>
                    <Tabs
                        className='tabs'
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        textColor="inherit"
                        style={{fontWeight:'600'}}
                    >
                        <Tab label="Todos" {...a11yProps(0)} />
                        <Tab label="Vaga" {...a11yProps(1)} />
                        <Tab label="Produto" {...a11yProps(2)} />
                        <Tab label="Serviço" {...a11yProps(3)} />
                        <Tab label="Evento" {...a11yProps(4)} />
                    </Tabs>
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <AllAnuncio />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <AnuncioVaga />
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <AnuncioProduto />
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        <AnuncioServico />
                    </TabPanel>
                    <TabPanel value={value} index={4} dir={theme.direction}>
                        <AnuncioEvento />
                    </TabPanel>
                </Box>
            </div>
        </div>
    )
}

export default Anuncios
