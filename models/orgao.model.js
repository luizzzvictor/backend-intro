import { Schema, model } from "mongoose";

const orgaoSchema = new Schema(
  {
    NOM_ORGAO: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    SEQ_ORGAO: {
      type: Number,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 8,
    },
    SEQ_MUNICIPIO: { 
        type: Number,
        required: true,
        minLength: 1,
        maxLength: 8,
    },
  },
  {
    timestamps: true,
  }
);

const OrgaoModel = model("Orgao", orgaoSchema);

export default OrgaoModel;
