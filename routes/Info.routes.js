import express from "express";
import InfoModel from "../models/Info.model.js";
import ReparacaoModel from "../models/Reparacao.model.js";
import dataInfos from "../data/infos.json" assert { type: "json" };

const infoRouter = express.Router();

infoRouter.get("/", async (req, res) => {
  try {
    const infos = await InfoModel.find().populate("reparacao", "reparacao");

    console.log(infos.length, "Infos cadastradas!👁️");

    return res.status(200).json(infos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});

infoRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const info = await InfoModel.findById(id).populate("reparacao", "reparacao");

    if (!info) {
      return res.status(404).json("Info não foi encontrada!");
    }

    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});

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

infoRouter.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const update = await InfoModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(update);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});

infoRouter.post("/p/createManyInfos", async (req, res) => {
  try {
    const postingInfos = await InfoModel.insertMany(dataInfos);
    console.log(postingInfos.length, `Infos criadas! ✅✅✅`);

    const creatingRefs = await postingInfos.forEach(async (eachInfo) => {
      const gettingRandomReparacação = await ReparacaoModel.count().exec(
        function (err, count) {
          // pegando número random dentre as reparações
          var random = Math.floor(Math.random() * 85);
          // console.log(random)
          //
          ReparacaoModel.findOne()
            .skip(random)
            .exec(async function (err, result) {
              const reparacaoAleatoria = await result.updateOne({
                $push: { infos_cumprimento: eachInfo._id },
              });
              await InfoModel.updateOne(eachInfo, { reparacao: result._id });
            });
        }
      );
    });
    console.log(postingInfos.length, `Infos povoadas aleatoriamente! 👨‍👨‍👦`);

    return res.status(201).json(postingInfos);
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

infoRouter.delete("/d/delete-all", async (request, response) => {
  try {
    const deleteAllInfos = await InfoModel.deleteMany();
    console.log(deleteAllInfos.deletedCount, `Infos deletadas! ❌❌❌`);

    await ReparacaoModel.updateMany({}, { infos_cumprimento: [] });

    return response.status(200).json(deleteAll);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});
