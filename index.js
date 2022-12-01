//com EXPRESS
import express from "express";
import * as dotenv from "dotenv";
import casosCorteIDHRouter from './routes/casosCorteIDH.routes.js'
import ReparacaoRouter from './routes/Reparacao.routes.js'
import dbConnection from './config/db.config.js'



//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

dbConnection()

// instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

// configurar o servidor para aceitar enviar e receber arquivos JSON
app.use(express.json());


app.use('/casosCorteIDH', casosCorteIDHRouter)
app.use('/reparacao', ReparacaoRouter)

// servidor subindo pro ar
app.listen(process.env.PORT, ()=> console.log("Server on Port 8080."))