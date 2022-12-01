import { model, Schema } from "mongoose";

// 1 para muitos, considerando os casos

const ReparacaoSchema = new Schema(
  {
    reparacao: {
      type: String,
    },
    status_cumprimento: {
      type: String,
      enum: [
        "Cumprida",
        "Parcialmente Cumprida",
        "Pendente de Cumprimento",
        "Descumprida",
      ],
    },
    caso: {
      //indicar que info será de ID
      type: Schema.Types.ObjectId,
      //setar a referência do ID
      ref: "CorteIDHcaso"
    }
  },
  {
    timestamps: true,
  }
);

const ReparacaoModel = model("Reparacoe", ReparacaoSchema);

export default ReparacaoModel;
