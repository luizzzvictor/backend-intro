import { model, Schema } from "mongoose";

// 1 para muitos, considerando os casos

const ReparacaoSchema = new Schema(
  {
    caso: {
      //indicar que info será de ID
      type: Schema.Types.ObjectId,
      //setar a referência do ID
      ref: "CorteIDHcaso"
    },
    nome_caso: String,
    reparacao: {
      type: String,
    },
    estado_cumprimento: {
      type: String,
      enum: [
        "Cumprida",
        "Parcialmente cumprida",
        "Pendente de cumprimento",
        "Descumprida",
      ],
    },
    resolucao_sup_declaratoria: {
      type: String
    },
    infos_cumprimento:[
      {
        type: Schema.Types.ObjectId,
        ref: "Info"
      }
    ]
    
  },
  {
    timestamps: true,
  }
);

const ReparacaoModel = model("Reparacoe", ReparacaoSchema);

export default ReparacaoModel;
