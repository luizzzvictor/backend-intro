// // com NODE puro \/
// import {createServer} from 'http'

// const server = createServer((request, response) => {
//     console.log("Hello world!")
//     response.end()
// })
// server.listen(8080, ()=> console.log('Hello! Está caco?'))

//com EXPRESS
import express from "express";
import * as dotenv from "dotenv";
import casosCorteIDHRouter from './routes/casosCorteIDH.routes.js'
import casosCIDHRouter from './routes/casosCIDH.routes.js'

dotenv.config();

const app = express();

app.use(express.json());

app.use('/casosCorteIDH', casosCorteIDHRouter)
app.use('/casosCIDH', casosCIDHRouter)


app.listen(Number(process.env.PORT), ()=> console.log("Server on Port 8080."))