// Comando que configura el archivo de .env 
// Verifica que el antorno no sea de produccion, en caso de no serlo permite accesso al .env local,
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Importacion de las dependencias necesarias para la elaboracion del servidor
const express = require('express');
const cors = require('cors');
//const DB = require('./Utils/db_connect');
//const seeder = require('./Seeds/db_seeder');
const Model = require('./Migrations/Model');
const Usuario = require('./Migrations/Usuario');

// Importacion de las Rutas Necesarias para la plataforma
const inicios_routes = require('./Routes/inicios');
const casos_routes = require('./Routes/casos');
const cirugias_routes = require('./Routes/cirugias');
const consultas_routes = require('./Routes/consultas');
const especialistas_routes = require('./Routes/especialistas');
const pacientes_routes = require('./Routes/pacientes');
const productos_routes = require('./Routes/productos');
const transacciones_routes = require('./Routes/transacciones');
const usuarios_routes = require('./Routes/usuarios');

// Ejecucion de Express
const app = express();

// Numero del Puerto del Servidor
const PORT = 3001;

//PROXY que permite comunicacion entre cliente y servidor
app.use(cors({ origin: 'http://localhost:3000/' }));

// Middleware que convierte los datos provenientes de los request a formato JSON (BODY PARSE)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware de los Routes/Rutas
app.use('/', inicios_routes)
app.use('/casos', casos_routes);
app.use('/cirugias', cirugias_routes);
app.use('/consultas', consultas_routes);
app.use('/especialistas', especialistas_routes);
app.use('/pacientes', pacientes_routes);
app.use('/productos', productos_routes);
app.use('/transacciones', transacciones_routes);
app.use('/usuarios', usuarios_routes);

app.get("/test", async (req, res) => {
    /*const dbModel = new Model('transacciones');
    const results = await dbModel.get();
    res.json(results);*/
    const model = new Usuario(7);
    const user = await model.getUser();
    //const results = await model.casos();
    //const results = await model.cirugias();
    //const results = await model.consultas();
    //const results = await model.pacientes();
    const results = await model.transacciones();
    if (results[0].success === false) return res.status(results[0].status).json(results);
    return res.json(results);
});

// Iniciar Servidor en Puerto Designado
app.listen(PORT, () => {
    console.log(`Conectado al Puerto:${PORT}`);
});