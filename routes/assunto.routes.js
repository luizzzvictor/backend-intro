import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import AssuntoModel from "../models/assunto.model.js";

const assuntoRoute = express.Router();

//get-all
assuntoRoute.get("/getall", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const tAssuntos = await AssuntoModel.find();
    return res.status(200).json(tAssuntos);    
  } catch (error) {
    console.log("Erro ao buscar Assuntos");
    return res.status(400).json({ msg: "Erro ao buscar Assuntos" });
  }
});


//insert
assuntoRoute.post("/insert", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  try {
    const newUser = await AssuntoModel.create({
      ...req.body,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Erro ao inserir um Assunto");
    return res.status(500).json({ msg: "Erro ao inserir um Assunto" });
  }
});


//getid:/id
assuntoRoute.get("/getid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tAssuntos = await AssuntoModel.findById(id);
    return res.status(200).json(tAssuntos);    
  } catch (error) {
    console.log("Erro ao buscar um Assunto");
    return res.status(400).json({ msg: "Erro ao buscar um Assunto" });
  }
});


//replaceid:/id
assuntoRoute.put("/replaceid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tAssuntos = await AssuntoModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(tAssuntos);    
  } catch (error) {
    console.log("Erro ao gravar alteração de um Assunto");
    return res.status(400).json({ msg: "Erro ao gravar alteração de um Assunto" });
  }
});


//deleteid:/id
assuntoRoute.delete("/deleteid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tAssuntos = await AssuntoModel.findByIdAndDelete(
      { _id: id },
    );
    return res.status(200).json(tAssuntos);    
  } catch (error) {
    console.log("Erro ao deletar um Assunto");
    return res.status(400).json({ msg: "Erro ao deletar um Assunto" });
  }
});

export default assuntoRoute;
