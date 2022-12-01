import { model, Schema } from "mongoose";

const casoCorteIDHSchema = new Schema(
  {
    caso: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["Caso Contencioso", "Medidas Provisórias"],
    },
    data_sentenca: {
      type: Date,
    },
    localidade: {
      estado: { type: String },
      cidade: { type: String },
    },
    vítimas: {
        type: Array,
    },
    em_tramitacao: {
      type: Boolean,
    },
    em_supervisao: {
      type: Boolean,
    },
    n_medidas_reparacao: {
        type: Number
    },
    medidas_reparacao: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reparacoe"
      }
    ]
    //checar possibilidade de referência cruzada, array com todas as medidas de reparação
  },
  {
    timestamps: true,
  }
);

const CasoCorteIDHModel = model("CorteIDHcaso", casoCorteIDHSchema);

export default CasoCorteIDHModel;
