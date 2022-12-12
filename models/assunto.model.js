import { Schema, model } from "mongoose";

const assuntoSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const AssuntoModel = model("Assunto", assuntoSchema);

export default AssuntoModel;
