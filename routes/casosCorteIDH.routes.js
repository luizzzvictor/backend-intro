import express from "express";
import CasoCorteIDHModel from "../models/casosCorteIDH.models.js";
import ReparacaoModel from "../models/Reparacao.model.js";
import InfoModel from "../models/Info.model.js";
import dataCasos from "../data/casos.json" assert { type: "json" };
import dataReparacoes from "../data/reparacoes.json" assert { type: "json" };
import dataInfos from "../data/infos.json" assert { type: "json" };

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const casos = await CasoCorteIDHModel.find().populate("medidas_reparacao");
    console.log(casos.length, "Casos cadastrados!👁️");

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
      return response.status(404).json("Caso não foi encontrado!");
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
    console.log(postAllCasos.length, `Casos criados! ✅✅✅`);

    return response
      .status(201)
      .json({ notificacao: `${postAllCasos.length} Casos criados! ✅✅✅` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.post("/populateDB", async (req, res) => {
  try {
    const postAllCasos = await CasoCorteIDHModel.insertMany(dataCasos);
    console.log(postAllCasos.length, `Casos criados! ✅✅✅`);

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
    const postingInfos = await InfoModel.insertMany(dataInfos);
    console.log(postingInfos.length, `Infos criadas! ✅✅✅`);

    const creatingRefs2 = await postingInfos.forEach(async (eachInfo) => { 
        
          var random = Math.floor(Math.random() * 85);
         
          await ReparacaoModel.findOne()
            .skip(random)
            .exec(async function (err, result) {
              const reparacaoAleatoria = await result.updateOne({
                $push: { infos_cumprimento: eachInfo._id },
              });
              await InfoModel.updateOne(eachInfo, { reparacao: result._id });
            });   
    });
    console.log(postingInfos.length, `Infos povoadas aleatoriamente! 👨‍👨‍👦`);
    console.log(`DB montada! 😎 `);

    return res.status(201).json({ notificacao: `DB montada! 💨💨💨 ` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
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
    console.log(deleteAllCasos.deletedCount, `Casos deletados! ❌❌❌`);

    return response.status(200).json(deleteAllCasos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.delete("/zerarDB", async (request, response) => {
  try {
    const deleteAllCasos = await CasoCorteIDHModel.deleteMany();
    console.log(deleteAllCasos.deletedCount, `Casos deletados! ❌❌❌`);

    const deleteAllReparacoes = await ReparacaoModel.deleteMany();
    console.log(
      deleteAllReparacoes.deletedCount,
      `Medidas de Reparação deletadas! ❌❌❌`
    );

    const deleteAllInfos = await InfoModel.deleteMany();
    console.log(deleteAllInfos.deletedCount, `Infos deletadas! ❌❌❌`);

    console.log(`DB Zerada! 💀 `);

    return response.status(200).json(deleteAllCasos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});
export default router;
