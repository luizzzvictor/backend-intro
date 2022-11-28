import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router()

let data = [
    {
      name: "Ana",
      departament: "TI",
    },
  ];
  
  router.get("/", (request, response) => {
    return response.status(200).json(data);
  });
  
  router.post("/create", (request, response) => {
    const newData = {
      ...request.body,
      id: uuidv4(),
    };
  
    console.log(request)
  
    data.push(newData);
  
    return response.status(201).json(data)
  });
  
  router.put('/edit/:id', (request, response) => {
   
  })
  
  router.delete('/delete/:id', (request, response) => {})

export default router