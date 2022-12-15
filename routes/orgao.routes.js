import express from "express";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import OrgaoModel from "../models/orgao.model.js";
import dataOrgaos from "../data/data-users/dataTribunais(filtrado).json" assert { type: "json" }

const orgaoRoute = express.Router();

//get-all
orgaoRoute.get("/getall", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const tOrgaos = await OrgaoModel.find();
    return res.status(200).json(tOrgaos);    
  } catch (error) {
    console.log("Erro ao buscar Órgãos");
    return res.status(400).json({ msg: "Erro ao buscar Órgãos" });
  }
});

orgaoRoute.get("/getall-nologin", async (req, res) => {
  try {
    const tOrgaos = await OrgaoModel.find();
    return res.status(200).json(tOrgaos);    
  } catch (error) {
    console.log("Erro ao buscar Órgãos");
    return res.status(400).json({ msg: "Erro ao buscar Órgãos" });
  }
});


//insert
orgaoRoute.post("/insert", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  try {
    const newUser = await OrgaoModel.create({
      ...req.body,
      "SEQ_ORGAO": parseInt(req.body.SEQ_ORGAO),
      "SEQ_MUNICIPIO": parseInt(req.body.SEQ_MUNICIPIO)
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Erro ao inserir um Órgão");
    return res.status(500).json({ msg: "Erro ao inserir um Órgão" });
  }
});

orgaoRoute.post("/insert-all", async (req, res) => {
  try{
    const insertAllOrgaos = await OrgaoModel.insertMany(dataOrgaos)
    console.log(insertAllOrgaos.length, `Órgãos criados! ✅✅✅`);

    return res
    .status(201)
    .json({ notificacao: `${insertAllOrgaos.length} Órgãos criados! ✅✅✅` })

  } catch(error) {
    console.log(error)
    return res.status(500).json({ msg: "Erro ao inserir o cadastro geral de Órgãos" });
  }
} )


//getid:/id
orgaoRoute.get("/getid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tOrgaos = await OrgaoModel.findById(id);
    return res.status(200).json(tOrgaos);    
  } catch (error) {
    console.log("Erro ao buscar um Órgão");
    return res.status(400).json({ msg: "Erro ao buscar um Órgão" });
  }
});


//replaceid:/id
orgaoRoute.put("/replaceid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tOrgaos = await OrgaoModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(tOrgaos);    
  } catch (error) {
    console.log("Erro ao gravar alteração de um Órgão");
    return res.status(400).json({ msg: "Erro ao gravar alteração de um Órgão" });
  }
});


//deleteid:/id
orgaoRoute.delete("/deleteid/:id", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tOrgaos = await OrgaoModel.findByIdAndDelete(
      { _id: id },
    );
    return res.status(200).json(tOrgaos);    
  } catch (error) {
    console.log("Erro ao deletar um Órgão");
    return res.status(400).json({ msg: "Erro ao deletar um Órgão" });
  }
});

export default orgaoRoute;
