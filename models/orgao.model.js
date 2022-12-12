import { Schema, model } from "mongoose";

const orgaoSchema = new Schema(
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
      minLength: 1,
      maxLength: 8,
    },
    municipio: { 
        type: String,
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
