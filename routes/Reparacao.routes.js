import express from "express";
import { v4 as uuidv4 } from "uuid";
import ReparacaoModel from "../models/Reparacao.model.js";

const router = express.Router();

let data = [
  {
    reparacao: "Brasil deve promover cursos",
    status_cumprimento: "Pendente de Cumprimento",
    caso:"Ximenes Lopes"   
  },
];

router.get("/", async (request, response) => {
  try {
    const casos = await ReparacaoModel.find();
    return response.status(200).json(casos);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (request,response) => {
  try {
    const {id} = request.params

    const caso = await ReparacaoModel.findById(id)

    if (!caso) {
      return response.status(404).json("Usuário não foi encontrado!")
    }

    return response.status(200).json(caso)

  } catch (error) {
    console.log (error)
    return response.status.apply(500).json({msg: "Algo está errado"})
  }
})


router.post("/create", async (request, response) => {
  try {
    const newCaso = await ReparacaoModel.create(request.body);

    // modo antigo
    // const newData = {
    //   ...request.body,
    //   id: uuidv4(),
    // };
    // data.push(newData);
    //modo antigo

    return response.status(201).json(newCaso);
  } catch (error) {
    console.log(error);

    return response.status(500).json({ msg: "Algo está errado." });
  }
});

router.put("/edit/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const update = await ReparacaoModel.findByIdAndUpdate(
      id,
      {
        ...request.body,
      },
      { new: true, runValidators: true }
    );

    return response.status(200).json(update);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.delete("/delete/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const deleteCaso = await ReparacaoModel.findByIdAndDelete(id);

    return response.status(200).json(deleteCaso);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

export default router;
