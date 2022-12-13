import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    passwordHash: { 
      type: String, 
      //required: true 
    },
    telefone: {
      type: String,
      required: true,
      minLength: 9,
      maxLength: 20,
    },
    role: {
      type: String,
      enum: ["admin", "prestador", "vitima", "representante", "interessado"],
      default: "admin",
    },
    orgao: [
      {type:Schema.Types.ObjectId, ref:"Orgao"}
    ],
    confirmEmail: {
      type: Boolean,
      default: true,
    },
    aprovadoUser: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
