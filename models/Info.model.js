import { model, Schema } from "mongoose";

// 1 para muitos, considerando os casos

const InfoSchema = new Schema(
  {
    caso: {
      //indicar que info será de ID
      type: Schema.Types.ObjectId,
      //setar a referência do ID
      ref: "CorteIDHcaso"
    },
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
        // ref: AQUI_INFOS
      }
    ]
    
  },
  {
    timestamps: true,
  }
);

const InfoModel = model("Info", InfoSchema);

export default InfoModel;
