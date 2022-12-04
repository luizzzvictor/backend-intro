import express, { json } from "express";
import CasoCorteIDHModel from "../models/casosCorteIDH.models.js";
import ReparacaoModel from "../models/Reparacao.model.js";
import dataReparacoes from "../data/reparacoes.json" assert { type: "json" };
import InfoModel from "../models/Info.model.js";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const reparacoes = await ReparacaoModel.find().populate("caso", "caso");
    console.log(reparacoes.length, "Reparações cadastradas!👁️");
    // .populate("caso") para popular
    return response.status(200).json(reparacoes);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const reparacao = await ReparacaoModel.findById(id).populate(
      "infos_cumprimento",
      "infos_relevantes"
    );

    if (!reparacao) {
      return response.status(404).json("Usuário não foi encontrado!");
    }

    return response.status(200).json(reparacao);
  } catch (error) {
    console.log(error);
    return response.status.apply(500).json({ msg: "Algo está errado" });
  }
});

// forma de passar o params relacionado a collection de casos principal
router.post("/create/:casoId", async (request, response) => {
  try {
    const { casoId } = request.params;

    // seto o campo 'caso' da Reparacao com o ID do CasoCorteIDH passado no params
    const newReparacao = await ReparacaoModel.create({
      ...request.body,
      caso: casoId,
    });

    // próxima etapa é dar um push no ID da nova repação no array de medidas de reparacao de cada caso.
    await CasoCorteIDHModel.findByIdAndUpdate(casoId, {
      $push: { medidas_reparacao: newReparacao._id },
    });

    return response.status(201).json(newReparacao);
  } catch (error) {
    console.log(error);

    return response.status(500).json({ msg: "Algo está errado." });
  }
});

router.post("/create-all", async (request, response) => {
  try {
    // async function postAllReparacoes() {
    const postingReparacoes = await ReparacaoModel.insertMany(dataReparacoes);
    console.log(
      postingReparacoes.length,
      `Medidas de Reparação criadas! ✅✅✅`
    );
    const creatingRefs = await postingReparacoes.forEach(
      async (eachReparacao) => {
        const casoCorrelato = await CasoCorteIDHModel.findOneAndUpdate(
          { caso: eachReparacao.nome_caso },
          { $push: { medidas_reparacao: eachReparacao._id } }
        );
        const updatingCasoIdNaReparacao = await ReparacaoModel.updateOne(
          eachReparacao,
          { caso: casoCorrelato._id }
        );
      }
    );
    // }

    return response
      .status(201)
      .json({
        notificacao: `${postingReparacoes.length} Medidas de Reparação criadas! ✅✅✅`,
      });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo deu errado." });
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

    const deleteReparacao = await ReparacaoModel.findByIdAndDelete(id);
    // complexo processo de deletar rs
    await CasoCorteIDHModel.findByIdAndUpdate(deleteReparacao.caso, {
      $pull: { medidas_reparacao: deleteReparacao._id },
    });

    return response.status(200).json(deleteReparacao);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});
router.delete("/delete-all", async (request, response) => {
  try {
    const deleteAll = await ReparacaoModel.deleteMany();
    console.log(
      deleteAll.deletedCount,
      `Medidas de Reparação deletadas! ❌❌❌`
    );

    await CasoCorteIDHModel.updateMany({}, { medidas_reparacao: [] });
    // await InfoModel.deleteMany()

    return response.status(200).json(deleteAll);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

export default router;
