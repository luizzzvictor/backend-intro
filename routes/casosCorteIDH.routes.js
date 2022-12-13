import express from "express";
import casoCorteIDHModel from "../models/casosCorteIDH.models.js";
import reparacaoModel from "../models/reparacao.model.js";
import infoModel from "../models/info.model.js";
import dataCasos from "../data/casos.json" assert { type: "json" };
import dataReparacoes from "../data/reparacoes.json" assert { type: "json" };
import dataInfos from "../data/infos.json" assert { type: "json" };
import dataCasosEPalavras from "../data/filtroCasosPalavrasChave.json" assert {type: "json"};
import AssuntoModel from "../models/assunto.model.js";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const casos = await casoCorteIDHModel.find().populate("medidas_reparacao").populate("palavras_chave");
    console.log(casos.length, "Casos cadastrados!👁️");

    return response.status(200).json(casos);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const caso = await casoCorteIDHModel
      .findById(id)
      .populate("medidas_reparacao").populate("palavras_chave");

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
    const newCaso = await casoCorteIDHModel.create(request.body);

    return response.status(201).json(newCaso);
  } catch (error) {
    console.log(error);

    return response.status(500).json({ msg: "Algo está errado." });
  }
});

router.post("/create-all", async (request, response) => {
  try {
    const postAllCasos = await casoCorteIDHModel.insertMany(dataCasos);
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
    const postAllCasos = await casoCorteIDHModel.insertMany(dataCasos);
    console.log(postAllCasos.length, `Casos criados! ✅✅✅`);

    const palavrasChave = await AssuntoModel.find()

    palavrasChave.map(async (p) => {

      for (let i=0; i< dataCasosEPalavras.length; i++) {
        if (dataCasosEPalavras[i].palavras_chave.includes(p.palavra_chave)) {
          await casoCorteIDHModel.findOneAndUpdate(
            { caso: dataCasosEPalavras[i].caso },
          { $push: { palavras_chave: p._id } }
          )
        }
      }
    })

    const postingReparacoes = await reparacaoModel.insertMany(dataReparacoes);
    console.log(
      postingReparacoes.length,
      `Medidas de Reparação criadas! ✅✅✅`
    );
    const creatingRefs = await postingReparacoes.forEach(
      async (eachReparacao) => {
        const casoCorrelato = await casoCorteIDHModel.findOneAndUpdate(
          { caso: eachReparacao.nome_caso },
          { $push: { medidas_reparacao: eachReparacao._id } }
        );
        const updatingCasoIdNaReparacao = await reparacaoModel.updateOne(
          eachReparacao,
          { caso: casoCorrelato._id }
        );
      }
    );
    const postingInfos = await infoModel.insertMany(dataInfos);
    console.log(postingInfos.length, `Infos criadas! ✅✅✅`);

    const creatingRefs2 = await postingInfos.forEach(async (eachInfo) => {
      let random = Math.floor(Math.random() * 85);

      await reparacaoModel
        .findOne()
        .skip(random)
        .exec(async function (err, result) {
          const reparacaoAleatoria = await result.updateOne({
            $push: { infos_cumprimento: eachInfo._id },
          });
          await infoModel.updateOne(eachInfo, { reparacao: result._id });
        });
    });

    console.log(postingInfos.length, `Infos povoadas aleatoriamente! 👨‍👨‍👦`);
    console.log(`DB montada! 😎 `);

    return res.status(201).json({ notificacao: `DB montada! 💨💨💨` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Algo está errado" });
  }
});

router.put("/edit/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const update = await casoCorteIDHModel.findByIdAndUpdate(
      id,
      {
        ...request.body,
      },
      { new: true, runValidators: true }
    );
    
    console.log(`💡`,update.caso, `💡 editado com sucesso! 📝 `)


    return response.status(200).json(update);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.delete("/delete/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const deleteCaso = await casoCorteIDHModel.findByIdAndDelete(id);

    const reparacoesAssociadas = await reparacaoModel.find({ caso: id });

    let countInfosDeletadas = 0;

    for (let eachReparacao of reparacoesAssociadas) {
      eachReparacao.infos_cumprimento.map(async (eachInfo) => {
        await infoModel.findByIdAndDelete(eachInfo);
        countInfosDeletadas++;
      });
    }

    await reparacaoModel.deleteMany({ caso: id });

    console.log(
      `💡`,
      deleteCaso.caso,
      `💡 deletado! ❌`,
      "\n",
      reparacoesAssociadas.length,
      `reparações associadas deletadas ❌❌❌!`,
      "\n",
      countInfosDeletadas,
      `info(s) associadas deletada(s)!❌❌❌`
    );

    return response.status(200).json(deleteCaso);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.delete("/delete-all", async (request, response) => {
  try {
    const deleteAllCasos = await casoCorteIDHModel.deleteMany();
    console.log(deleteAllCasos.deletedCount, `Casos deletados! ❌❌❌`);

    return response.status(200).json(deleteAllCasos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

router.delete("/zerarDB", async (request, response) => {
  try {
    const deleteAllCasos = await casoCorteIDHModel.deleteMany();
    console.log(deleteAllCasos.deletedCount, `Casos deletados! ❌❌❌`);

    const deleteAllReparacoes = await reparacaoModel.deleteMany();
    console.log(
      deleteAllReparacoes.deletedCount,
      `Medidas de Reparação deletadas! ❌❌❌`
    );

    const deleteAllInfos = await infoModel.deleteMany();
    console.log(deleteAllInfos.deletedCount, `Infos deletadas! ❌❌❌`);

    console.log(`DB Zerada! 💀 `);

    return response.status(200).json(deleteAllCasos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});
export default router;
