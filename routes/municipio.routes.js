import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import MunicipioModel from "../models/municipio.model.js";
import dataMunicipios from "../data/data-users/dataMunicipios.json" assert { type: "json" }

const municipioRoute = express.Router();

//get-all
municipioRoute.get("/getall", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const tMunicipios = await MunicipioModel.find();
    return res.status(200).json(tMunicipios);    
  } catch (error) {
    console.log("Erro ao buscar Municípios");
    return res.status(400).json({ msg: "Erro ao buscar Municípios" });
  }
});


//insert
municipioRoute.post("/insert", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  try {
    const newUser = await MunicipioModel.create({
      ...req.body,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Erro ao inserir um Município");
    return res.status(500).json({ msg: "Erro ao inserir um Município" });
  }
});

municipioRoute.post("/insert-all", async (req, res) => {
  try{
    const insertAllMunicipios = await MunicipioModel.insertMany(dataMunicipios)
    console.log(insertAllMunicipios.length, `Municípios criados! ✅✅✅`);

    return res
    .status(201)
    .json({ notificacao: `${insertAllMunicipios.length} Municipios criados! ✅✅✅` })

  } catch(error) {
    console.log(error)
    return res.status(500).json({ msg: "Erro ao inserir o cadastro geral de Municípios" });
  }
} )


//getid:/id
municipioRoute.get("/getid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tMunicipios = await MunicipioModel.findById(id);
    return res.status(200).json(tMunicipios);    
  } catch (error) {
    console.log("Erro ao buscar um Município");
    return res.status(400).json({ msg: "Erro ao buscar um Município" });
  }
});


//replaceid:/id
municipioRoute.put("/replaceid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tMunicipios = await MunicipioModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(tMunicipios);    
  } catch (error) {
    console.log("Erro ao gravar alteração de um Município");
    return res.status(400).json({ msg: "Erro ao gravar alteração de um Município" });
  }
});


//deleteid:/id
municipioRoute.delete("/deleteid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tMunicipios = await MunicipioModel.findByIdAndDelete(
      { _id: id },
    );
    return res.status(200).json(tMunicipios);    
  } catch (error) {
    console.log("Erro ao deletar um Município");
    return res.status(400).json({ msg: "Erro ao deletar um Município" });
  }
});

export default municipioRoute;
