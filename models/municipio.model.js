import { Schema, model } from "mongoose";

const municipioSchema = new Schema(
  {
    SEQ_ORGAO: {
      type: Number,
      required: true,
      unique:true,
      minLength: 2,
      maxLength: 50,
    },
    NOM_ORGAO: {
      type: String,
      // required: true,
      minLength: 1,
      maxLength: 150,
    },
    SEQ_MUNICIPIO: {
      type: Number,
      // required: true,
      minLength: 2,
      maxLength: 10,
    },
    UF: {
      type: String,
      required: true,
      uppercase: true,
      minLength: 2,
      maxLength: 2,
    }
  },
  {
    timestamps: true,
  }
);

const MunicipioModel = model("Municipio", municipioSchema);

export default MunicipioModel;
