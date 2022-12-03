import express from "express";
import CasoCorteIDHModel from "../models/casosCorteIDH.models.js";
import ReparacaoModel from "../models/Reparacao.model.js";
import dataCasos from "../data/casos.json" assert { type: "json" };

const router = express.Router();


router.get("/", async (request, response) => {
  try {
    const casos = await CasoCorteIDHModel.find().populate("medidas_reparacao");
    return response.status(200).json(casos);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const caso = await CasoCorteIDHModel.findById(id).populate(
      "medidas_reparacao"
    );

    if (!caso) {
      return response.status(404).json("Usuário não foi encontrado!");
    }

    return response.status(200).json(caso);
  } catch (error) {
    console.log(error);
    return response.status.apply(500).json({ msg: "Algo está errado" });
  }
});

router.post("/create", async (request, response) => {
  try {
    const newCaso = await CasoCorteIDHModel.create(request.body);

    return response.status(201).json(newCaso);
  } catch (error) {
    console.log(error);

    return response.status(500).json({ msg: "Algo está errado." });
  }
});

router.post("/create-all", async (request, response) => {
  try {
    const postAllCasos = await CasoCorteIDHModel.insertMany(dataCasos);
    console.log( postAllCasos.length,`Casos criados! ✅✅✅`)

    return response.status(201).json({notificacao: `${postAllCasos.length} Casos criados! ✅✅✅`});
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.put("/edit/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const update = await CasoCorteIDHModel.findByIdAndUpdate(
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

    const deleteCaso = await CasoCorteIDHModel.findByIdAndDelete(id);

    await ReparacaoModel.deleteMany({ caso: id });

    return response.status(200).json(deleteCaso);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.delete("/delete-all", async (request, response) => {
  try {
    const deleteAllCasos = await CasoCorteIDHModel.deleteMany();
    console.log(deleteAllCasos.deletedCount,`Casos deletados! ❌❌❌`)

    return response.status(200).json(deleteAllCasos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

export default router;
