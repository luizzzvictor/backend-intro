import { model, Schema } from "mongoose";

// 1 para muitos, considerando as reparações

const InfoSchema = new Schema(
  {
    reparacao: {
      type: Schema.Types.ObjectId,
      ref: "Reparacoe"
    },   
    tribunal: String,
    unidade_judiciaria: String,
    infos_relevantes: String,    
    notificar_estado_cumprimento: {
      type: String,
      enum: [
        "Cumprida",
        "Parcialmente cumprida",
        "Pendente de cumprimento",
        "Descumprida",
      ],
    }
    //incluir usuário responsável pelo cadastro    
  },
  {
    timestamps: true,
  }
);

const InfoModel = model("Info", InfoSchema);

export default InfoModel;
