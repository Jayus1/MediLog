import { Formik, Form } from "formik";
import useMultiForm from "../Hooks/useMultiForm";
import ContactInformationForm from "./forms/ContactInformationForm";
import BasicInformationForm from "./forms/BasicInformationForm";
import useDataRegisterStore from "../ZustandRegisterManagement";

import registerDoctor from "/assets/Pictures/registerDoctor.jpg";
import asianDoctor from "/assets/Pictures/asianDoctor.jpeg";
import indianDoctor from "/assets/Pictures/indianDoctor.jpg";
import registerExample from "/assets/Pictures/registerExample.jpg";
import healthDoctor from "/assets/Pictures/healthDoctor.jpg";

import { registerValidationSchema } from "../Utils/yup-schema/yupRegisterSchema";
import FinancialInformationForm from "./forms/FinancialInformationForm";
import PricingForm from "./forms/PricingForm";
import RegisterStepper from "./style/RegisterStyle/RegisterStepper";
import ThanksForm from "./forms/ThanksForm";
import useTheme from "@mui/material/styles/useTheme";
// import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid/Grid";
import Button from "@mui/material/Button/Button";
import styles from "../Components/style/RegisterStyle/RegisterTheme.module.css";
import { Fade, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../Common/Utils/setUserSession";
import axios from "axios";
import getBackendConnectionString from "../../../Common/Utils/getBackendString";
import { useEffect, useState } from "react";

const ImageArray = [
  registerDoctor,
  asianDoctor,
  indianDoctor,
  registerExample,
  healthDoctor,
];

const initialValues = [
  {
    nombre: "",
    apellido: "",
    sexo: "",
    fecha_nacimiento: "",
    tipo: "",
    especialidad: undefined,
    documento_identidad: undefined,
  },

  {
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  },

  {
    pricing: "",
  },

  {
    metodo_pago: "",
    datos_financieros: "",
    cvv: "",
    fecha_expiracion: "",
    descripcion: "",
  },
];

const Register: React.FC = () => {
  const { authUser } = useUserStore();
  const { authenticated } = useUserStore();
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();

  //Funccion que denega acceso a la pagina de register si el usuario esta loggeado
  useEffect(() => {
    setLogged(authenticated());
    if (logged) {
      navigate("/");
      return;
    }
    return;
  }, [logged]);

  const { getRegisterData } = useDataRegisterStore();

  async function onSubmit() {
    if (currentStepIndex === steps.length - 2) {
      const result = await axios
        .post(
          getBackendConnectionString("register"),
          {
            nombre: getRegisterData("nombre"),
            apellido: getRegisterData("apellido"),
            fecha_nacimiento: getRegisterData("fecha_nacimiento"),
            documento_identidad: getRegisterData("documento_identidad"),
            sexo: getRegisterData("sexo"),
            correo: getRegisterData("correo"),
            direccion: getRegisterData("direccion"),
            telefono: getRegisterData("telefono"),
            especialidad: getRegisterData("especialidad"),
            member_id: getRegisterData("member_id"),
            contrasena: getRegisterData("contrasena"),
            tipo: getRegisterData("tipo"),
            plan: getRegisterData("plan"),
            metodo_pago: getRegisterData("metodo_pago"),
            datos_financieros: getRegisterData("datos_financieros"),
            fecha_expiracion: getRegisterData("fecha_expiracion"),
            cvv: getRegisterData("cvv"),
            precio: getRegisterData("precio"),
            categoria: getRegisterData("categoria"),
            monto: getRegisterData("monto"),
            producto_id: getRegisterData("producto_id"),
            usuario_id: getRegisterData("usuario_id"),
            descripcion: getRegisterData("descripcion"),
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((response) => {
          //Condicion que verifica si la solicitud fue exitosa
          if (response.status === 201 || response.status === 200) {
            const incomingUser = response.data?.user;
            console.log(response);
            console.log(incomingUser);
            authUser(incomingUser);
            next();
            return { success: true, message: response.statusText };
          } else {
            const error_msj = response.data?.message;
            console.log(response);
            console.log(error_msj);
            return { success: false, message: error_msj };
          }
        })
        .catch((error) => {
          const error_msj = error?.response?.data?.message;
          console.log(error);
          console.log(error_msj);
          return { success: false, message: error_msj };
        });
      return result;
    } else if (isLastStep) {
      navigate("/"); // Redirige a esa ruta si el inicio de session fue exitoso
    } else {
      next();
    }
  }

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  //const { getRegisterData } = useDataRegisterStore();

  const { currentStepIndex, step, steps, isFirstStep, isLastStep, next, back } =
    useMultiForm([
      <BasicInformationForm type={String(getRegisterData("tipo")) || ""} />,
      <ContactInformationForm />,
      <PricingForm />,
      <FinancialInformationForm />,
      <ThanksForm />,
    ]);

    return (
        <Box height={isMediumScreen ? "105vh" : "auto"} className={styles.box}>
            <Grid container >
                {isMediumScreen && (
                    <Grid item xs={12} md={4}>
                        <Fade
                            in={true}
                            key={currentStepIndex}
                            timeout={1000}
                        >
                            <img className={styles.image} src={ImageArray[currentStepIndex]} alt="" />
                        </Fade>
                    </Grid>
                )}
                <Grid sx={{ paddingTop: "2rem" }} item xs={12} md={isMediumScreen ? 8 : 12}>
                    {!isLastStep && <RegisterStepper activeStep={currentStepIndex} />}
                    <Box className={styles.formContainer}>
                        <Formik
                            initialValues={initialValues[currentStepIndex]}
                            onSubmit={onSubmit}
                            validationSchema={registerValidationSchema[currentStepIndex]}>
                            {() => (
                                <Form>
                                    {step}
                                    <Box className={styles.buttonContainer}>
                                        {!isLastStep && <Button
                                            fullWidth
                                            disabled={isFirstStep ? true : false}
                                            className={styles.backButton}
                                            variant="outlined" type="button"
                                            onClick={back}>
                                            Regresar
                                        </Button>}
                                        <Button
                                            fullWidth
                                            className={styles.nextButton}
                                            variant="contained"
                                            type="submit">
                                            {!isLastStep ? "Siguiente" : "Finalizar"}
                                        </Button>
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
