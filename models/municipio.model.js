import { Schema, model } from "mongoose";

const municipioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    codigo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minLength: 1,
      maxLength: 8,
    },
    uf: { 
        type: String,
        required: true,
        uppercase: true,
        minLength: 2,
        maxLength: 2,
    },
  },
  {
    timestamps: true,
  }
);

const MunicipioModel = model("Municipio", municipioSchema);

export default MunicipioModel;
