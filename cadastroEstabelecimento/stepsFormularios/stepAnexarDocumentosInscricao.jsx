
import { Box } from "@material-ui/core"
import { Grid, Typography } from "@mui/material";
import InputFileUpload from '../../../../../../utils/inputFileUpload/inputDocUpload';


export default function FormAnexarDocumentos({ HandleChange }) {

    return (
        <Box>
            <Typography variant="h5" style={{ margin: 20 }}>
                ANEXAR DOCUMENTOS
            </Typography>

            <Grid container>

                <Grid xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'requerimentoARMED'} inputTitle={'Requerimento dirigido a ARMED'} />
                </Grid>

                <Grid xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'escrituraCS'} inputTitle={'Escritura de constituição de Sociedade (para Empresas)'} />
                </Grid>

                <Grid xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'termoRDT'} inputTitle={'Termo de Responsabilidade do Director Técnico e da Declaração Original da OFA (ou ASSOFARMA)'} />
                </Grid>

            </Grid>


            <Grid container>

                <Grid xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'copiaDI'} inputTitle={'Cópia colorida do documento de identificação'} />
                </Grid>

                <Grid xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'croquis'} inputTitle={'Planta com quota das instalações e croquis de localização'} />

                </Grid>

                <Grid disabled xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'comprovativoPE'} inputTitle={'Comprovativo de Pagamento de emolumentos'} />
                </Grid>

            </Grid>
            <Grid container>

      

                <Grid disabled xs={12} md item m >
                    <InputFileUpload onFileSelect={HandleChange} inputName={'certificadoND'} inputTitle={'Certificado de não devedor (AGT)'} />
                </Grid>
                <Grid disabled xs={12} md item m />
                <Grid disabled xs={12} md item m />

            </Grid>
        </Box>
    )
}


