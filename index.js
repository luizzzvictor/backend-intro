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
import { v4 as uuidv4 } from "uuid";
import employeeRouter from './routes/employee.routes.js'

dotenv.config();

const app = express();

app.use(express.json());

app.use('/employee', employeeRouter)
// app.use('/to-do', todoRouter)




app.listen(Number(process.env.PORT), ()=> console.log("Server on Port 8080."))