import express from "express";
import InfoModel from "../models/Info.model.js";
import ReparacaoModel from "../models/Reparacao.model.js";
import dataInfos from "../data/reparacoes.json" assert { type: "json" };


const infoRouter = express.Router();

infoRouter.post("/:reparacaoId", async (req, res) => {
  try {
    const { reparacaoId } = req.params;

    const newInfo = await InfoModel.create({
      ...req.body,
      reparacao: reparacaoId,
    });
    console.log(`Info sobre Medida de Reparação criada com sucesso! ✅✅✅`);
    await ReparacaoModel.findByIdAndUpdate(reparacaoId, {
      $push: { infos_cumprimento: newInfo._id },
    });

    return res.status(201).json(newInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});

infoRouter.get("/createManyInfos", async (req, res) => {
  try {
    // const postingInfos = await InfoModel.insertMany(dataInfos);
    // console.log(
    //   postingInfos.length,
    //   `Medidas de Reparação criadas! ✅✅✅`
    // );


    await ReparacaoModel.count().exec(function (err, count) {

        // Get a random entry
        var random = Math.floor(Math.random()*85)
        console.log(random)
      
        // Again query all users but only fetch one offset by our random #
        ReparacaoModel.findOne().skip(random).exec(
          function (err, result) {
            // Tada! random user
            // console.log(result) 
          })
      })


    // const creatingRefs = await postingInfos.forEach(
    //   async (eachReparacao) => {
    //     const reparacaoAleatoria = await ReparacaoModel.findOneAndUpdate(
    //       { caso: eachReparacao.nome_caso },
    //       { $push: { medidas_reparacao: eachReparacao._id } }
    //     );
    //     const updatingCasoIdNaReparacao = await ReparacaoModel.updateOne(
    //       eachReparacao,
    //       { caso: casoCorrelato._id }
    //     );
    //   }
    // );
    // }

    return res
      .status(201)
      .json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});

infoRouter.delete("/:infoId", async (req, res) => {
  try {
    const { infoId } = req.params;

    const deleteInfo = await InfoModel.findByIdAndDelete(infoId);

    await ReparacaoModel.findByIdAndUpdate(deleteInfo.reparacao, {
      $pull: { infos_cumprimento: infoId },
    });

    return res.status(200).json(deleteInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});
export default infoRouter;

infoRouter.delete("/delete-all", async (request, response) => {
  try {
    const deleteAll = await InfoModel.deleteMany();
    console.log(deleteAll.deletedCount, `Infos deletadas! ❌❌❌`);

    await ReparacaoModel.updateMany({}, { infos_cumprimento: [] });

    return response.status(200).json(deleteAll);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});
