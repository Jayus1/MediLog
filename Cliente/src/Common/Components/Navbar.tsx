import { Button, Grid, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function Navbar() {
  const navbarLinks = [
    {
      name: "Planes",
      link: "#planes",
    },
    {
      name: "Testimonios",
      link: "#testimonios",
    },
    // {
    //   name: "Inicio",
    //   link: "#inicio",
    // },

    {
      name: "Contactarnos",
      link: "#contactarnos",
    },
    {
      name: "Acerca de",
      link: "#acercaDe",
    },
  ];

  const navigate = useNavigate();

  return (
    <Grid
      container
      xs={12}
      sx={{
        width: "100%",
        backgroundColor: "#184E77",
      }}
      display={"flex"}
      justifyContent={"space-between"}
      color={"#FFFFFF"}
      flexDirection={"row"}
      padding={"10px 35px"}
    >
      <Grid
        xs={1}
        item
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography
          sx={{
            fontSize: "25px",
            fontWeight: "600",
            textTransform: "uppercase",
          }}
        >
          MediLog
        </Typography>
      </Grid>

      <Grid
        item
        container
        xs={7}
        display={"flex"}
        flexDirection={"row"}
        // gap={"24px"}
        alignItems={"center"}
        // marginRight={"15px"}
        justifyContent={"space-between"}
      >
        <Grid item container xs={7} direction="row" display={"flex"} gap={1}>
          {navbarLinks.map((nav, idx) => {
            return (
              // <Grid item display={"flex"}>
              <Link
                href={nav.link}
                key={idx}
                style={{
                  color: "#FFFFFF",
                  textDecorationLine: "none",
                  padding: "5px 10px",
                  // width: "20%",
                  // borderRight: "1px solid #958b8b",
                  // borderLeft: "1px solid #958b8b",
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                  // width: "90px",
                }}
              >
                {nav.name}
              </Link>
              // </Grid>
            );
          })}
        </Grid>

        <Grid
          item
          xs={4}
          display={"flex"}
          gap={"10px"}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Button
            sx={{
              color: "#FFF",
              fontSize: "16px",
            }}
            variant="text"
          >
            Iniciar Sesion
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#168AAD",
            }}
            onClick={() => navigate("/register")}
          >
            Registrarte
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
