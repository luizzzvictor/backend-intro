import express, { json } from "express";
import casoCorteIDHModel from "../models/casosCorteIDH.models.js";
import reparacaoModel from "../models/reparacao.model.js";
import dataReparacoes from "../data/reparacoes.json" assert { type: "json" };

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const reparacoes = await reparacaoModel.find().populate("caso", "caso");
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

    const reparacao = await reparacaoModel.findById(id).populate(
      "infos_cumprimento",
      "infos_relevantes"
    );

    if (!reparacao) {
      return response.status(404).json("Medida de Reparação não foi encontrada!");
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
    const newReparacao = await reparacaoModel.create({
      ...request.body,
      caso: casoId,
    });

    // próxima etapa é dar um push no ID da nova repação no array de medidas de reparacao de cada caso.
    await casoCorteIDHModel.findByIdAndUpdate(casoId, {
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
    
    const postingReparacoes = await reparacaoModel.insertMany(dataReparacoes);
    console.log(
      postingReparacoes.length,
      `Medidas de Reparação criadas! ✅✅✅`
    );    
    
    const creatingRefs = await postingReparacoes.forEach(
      async (eachReparacao) => {

        try {
          // console.log(eachReparacao)        
          const casoCorrelato = await casoCorteIDHModel.findOneAndUpdate(
            { caso: eachReparacao.nome_caso },
            { $push: { medidas_reparacao: eachReparacao._id } },
            {new:true}
          );
          // console.log(casoCorrelato)
          const updatingCasoIdNaReparacao = await reparacaoModel.findByIdAndUpdate(
            eachReparacao._id,
            { caso: casoCorrelato._id },
            {new:true}
          );

        } catch(error) {
          console.log(error)
        }
      }
    );
    

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

    const update = await reparacaoModel.findByIdAndUpdate(
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

    const deleteReparacao = await reparacaoModel.findByIdAndDelete(id);
    // complexo processo de deletar rs
    await casoCorteIDHModel.findByIdAndUpdate(deleteReparacao.caso, {
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
    const deleteAll = await reparacaoModel.deleteMany();
    console.log(
      deleteAll.deletedCount,
      `Medidas de Reparação deletadas! ❌❌❌`
    );

    await casoCorteIDHModel.updateMany({}, { medidas_reparacao: [] });

    return response.status(200).json(deleteAll);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ msg: "Algo está errado" });
  }
});

export default router;
