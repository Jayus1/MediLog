import { Formik, Form } from "formik";
import useMultiForm from "../Hooks/useMultiForm";
import ContactInformationForm from "./forms/ContactInformationForm";
import BasicInformationForm from "./forms/BasicInformationForm";
import useDataRegisterStore, { getAllRegisterData } from "../ZustandRegisterManagement";
import registerDoctor from "/assets/Pictures/registerDoctor.jpg"
import { registerValidationSchema } from "../Utils/yup-schema/yupRegisterSchema";
import FinancialInformationForm from "./forms/FinancialInformationForm";
import PricingForm from "./forms/PricingForm";
import RegisterStepper from "./style/RegisterStyle/RegisterStepper";
import ThanksForm from "./forms/ThanksForm";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid/Grid";
import Button from "@mui/material/Button/Button";
import styles from '../Components/style/RegisterStyle/RegisterTheme.module.css';


//TODO: Agregar listas para controlar elementos con Yup y crear documentacion
//agregar date control y comenzar con css module y/o material
// se ve feo, agregar todo en un sitio y mas lo que se repite
// Arreglar todo lo que esta mal, sobre todo las variables de prueba y el diseno
//ARREGLAR ARRAY DE VALORES INICIALES Y YUP, sexo al ser select no funciona como se espera
//Crear posible tema de material para que no se vea asi
//Arreglar fecha y cedula


const initialValues = [
    {
        nombre: "",
        apellido: "",
        sexo:"",
        fecha_nacimiento:"",
        tipo:"",
        especialidad:undefined,
        documento_identidad:undefined
    },

    {
        correo:"",
        contrasena:"",
        confirmarContrasena:""
    },

    {
        pricing:""
    },

    {
        metodo_pago: '',
        datos_financieros: '',
        cvv: '',
        fecha_expiracion: '',
        descripcion: '',
    }
]

const Register: React.FC = () => {
    function onSubmit() {
        console.log(getAllRegisterData());
        next()
    };
    
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

    const {getRegisterData } = useDataRegisterStore();

    const { currentStepIndex, step, isFirstStep, isLastStep ,next, back } = useMultiForm([
        <BasicInformationForm type={String(getRegisterData("tipo")) || ""} />,
        <ContactInformationForm />,
        <PricingForm/>,
        <FinancialInformationForm/>,
        <ThanksForm/>
    ])

    return (
         <Box height={isMediumScreen? "105vh" : "auto"} className={styles.box}>
            <Grid container spacing={2}>
                {isMediumScreen && (
                    <Grid item xs={12} md={4}>
                        <img className={styles.image} src={registerDoctor} alt="" />
                    </Grid>
                )}
                <Grid item xs={12} md={isMediumScreen ? 8 : 12}>
                    {!isLastStep && <RegisterStepper activeStep={currentStepIndex}/>}
                    <Box className={styles.formContainer}>
                        <Formik
                            initialValues={initialValues[currentStepIndex]}
                            onSubmit={onSubmit}
                            validationSchema={registerValidationSchema[currentStepIndex]}>
                            {() => (
                                <Form>
                                    {step}
                                    <Box className={styles.buttonContainer}>
                                        <Button fullWidth disabled={isFirstStep ? true : false} className={styles.backButton} variant="outlined" type="button" onClick={back}>Regresar</Button>
                                        <Button fullWidth className={styles.nextButton} variant="contained" type="submit">{!isLastStep ? "Siguiente" : "Finalizar"}</Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );

};

export default Register;
