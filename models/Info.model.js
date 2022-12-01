import { model, Schema } from "mongoose";

// 1 para muitos, considerando os casos

const InfoSchema = new Schema(
  {
    reparacao: {
      //indicar que info será de ID
      type: Schema.Types.ObjectId,
      //setar a referência do ID
      ref: "Reparacoe"
    },
    texto_reparacao: {
      type: String,
    },
    tribunal: ",asd",
    notificar_estado_cumprimento: {
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
    
    
  },
  {
    timestamps: true,
  }
);

const InfoModel = model("Info", InfoSchema);

export default InfoModel;
