import { Schema, model } from "mongoose";

const assuntoSchema = new Schema(
  {
    palavra_chave: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 200,
    },
    codigo: {
      type: Number,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 8,
    },
  },
  {
    timestamps: true,
  }
);

const AssuntoModel = model("Assunto", assuntoSchema);

export default AssuntoModel;
