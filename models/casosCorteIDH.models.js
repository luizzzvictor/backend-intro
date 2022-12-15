import { model, Schema } from "mongoose";

const casoCorteIDHSchema = new Schema(
  {
    tipo_de_decisao: {
      type: String,
      enum: ["Caso Contencioso", "Medidas Provisórias"],
    },
    caso: String,    
    localidade: {
      estado: { type: String },
      cidade: { type: String },
    },
    latitude: Number,
    longitude: Number,
    imagem: String,
    resumo_caso: String,
    vitimas: String,
    representantes: String,
    palavras_chave: [
      {type:Schema.Types.ObjectId, ref:"Assunto"}
    ],
    sentenca_link: String,
    link_portugues: String,
    ordem_sentencas: Number,
    cidh_peticao: Date,
    cidh_admissibilidade: Date,
    cidh_merito: Date,
    cidh_submissao: Date,
    corte_sentenca: Date,
    em_supervisao:Boolean,
    em_tramitacao: Boolean,
    n_medidas_reparacao: Number,
    medidas_reparacao: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reparacoe"
      }
    ]
  },
  {
    timestamps: true,
  }
);

const CasoCorteIDHModel = model("CorteIDHcaso", casoCorteIDHSchema);

export default CasoCorteIDHModel;
