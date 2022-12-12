//com EXPRESS
import express from "express";
import * as dotenv from "dotenv";
import casosCorteIDHRouter from './routes/casosCorteIDH.routes.js'
import reparacaoRouter from './routes/reparacao.routes.js'
import infoRouter from './routes/info.routes.js'
import dbConnection from './config/db.config.js'
import cors from "cors"




//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

dbConnection()

// instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

app.use(cors())

// configurar o servidor para aceitar enviar e receber arquivos JSON
app.use(express.json());


app.use('/casosCorteIDH', casosCorteIDHRouter)
app.use('/reparacao', reparacaoRouter)
app.use('/info', infoRouter)

// servidor subindo pro ar
app.listen(process.env.PORT, ()=> console.log("Server on Port 8080."))