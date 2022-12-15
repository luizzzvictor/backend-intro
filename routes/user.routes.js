import express from "express";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";
import nodemailer from "nodemailer";
// import TaskModel from "../models/task.model.js";
import UserModel from "../models/user.model.js";
import OrgaoModel from "../models/orgao.model.js";

const userRoute = express.Router();

const saltRounds = 10;

//credenciais do meu email
const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    secure: false,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
    tls: {
      rejectUnauthorized: false
    },
  },
});

//sign-up
userRoute.post("/sign-up", async (req, res) => {
  try {
    //capturand a senha do meu req.body
    const { password, email } = req.body;

    //checando se a senha EXISTE || se a senha passou nos pré requisitos
    if ( !password || !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/
      )
    ) {
      return res.status(400).json({ msg: "Senha não tem os requisitos mínimos de segurança" });
    }

    //gerar o salt
    const salt = await bcrypt.genSalt(saltRounds); //10

    //hashear senha
    const hashedPassword = await bcrypt.hash(password, salt);

    //criar o usuário com a senha hasheada
    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    //deleto a propriedade passwordHash do obj
    delete newUser._doc.passwordHash;

    //configuro o corpo do email
    const mailOptions = {
      from: "turma91wd@hotmail.com", //nosso email
      to: email, //o email do usuário
      subject: "Ativação de Conta",
      html: `
        <h1>Bem vindo ao nosso site.</h1>
        <p>Por favor, confirme seu email clicando no link abaixo.</p>
        <a href=http://localhost:8080/user/activate-account/${newUser._id}>ATIVE SUA CONTA</a>
      `,
    };

    //console.log(mailOptions)

    //envio do email
    await transporter.sendMail(mailOptions,(err,result)=>{
      if (err) console.log("Erro envio e-mail: " + err)
      console.log("Mensagem: " + result)
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});


//get-all
userRoute.get("/getall", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const tUsuarios = await UserModel.find().populate("orgao");
    return res.status(200).json(tUsuarios);    
  } catch (error) {
    console.log("Erro ao buscar Usuários");
    return res.status(400).json({ msg: "Erro ao buscar Usuários" });
  }
});

//profile
userRoute.get("/profileNV", isAuth, attachCurrentUser, async (req,res) => {
  try {

    const usuario = await UserModel.find(req.currentUser)

    const orgao = await OrgaoModel.findById(req.currentUser.orgao)

    const nomeOrgao = orgao.NOM_ORGAO

    return res.status(200).json(nomeOrgao)

  } catch(error) {
    console.log (error)
    return res.status(500).json(error.errors)
  }
})


//insert
userRoute.post("/insert", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  try {
    const newUser = await UserModel.create({
      ...req.body,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Erro ao inserir um Usuário");
    return res.status(500).json({ msg: "Erro ao inserir um Usuário" });
  }
});


//getid:/id
userRoute.get("/getid/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tUsuarios = await UserModel.findById(id);
    return res.status(200).json(tUsuarios);    
  } catch (error) {
    console.log("Erro ao buscar um Usuário");
    return res.status(400).json({ msg: "Erro ao buscar um Usuário" });
  }
});


//replaceid:/id
userRoute.put("/replaceid/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tUsuarios = await UserModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(tUsuarios);    
  } catch (error) {
    console.log("Erro ao gravar alteração de um Usuário");
    return res.status(400).json({ msg: "Erro ao gravar alteração de um Usuário" });
  }
});


//deleteid:/id
userRoute.delete("/deleteid/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const tUsuarios = await UserModel.findByIdAndDelete(
      { _id: id },
    );
    return res.status(200).json(tUsuarios);    
  } catch (error) {
    console.log("Erro ao deletar um Usuário");
    return res.status(400).json({ msg: "Erro ao deletar um Usuário" });
  }
});


//login
userRoute.post("/login", async (req, res) => {
  try {
    //capturando o email e o password do req.body
    const { email, password } = req.body;

    //achar o usuário no banco de dados pelo email
    const user = await UserModel.findOne({ email: email }).populate("orgao");

    //checar se o email existe no meu banco de dados
    if (!user) {
      console.log("Usuário não cadastrado");
      return res.status(400).json({ msg: "Usuário não cadastrado" });
    }

    //checar se o email está confirmado
    if (user.confirmEmail === false) {
      return res
        .status(401)
        .json({ msg: "Usuário não confirmado. Por favor validar email." });
    }

    //comparar a senha que usuário enviou com a senha hasheada que está no meu banco de dados
    //bcrypt tem um método chamado .compare(senha que usuário enviou, a senha hasheada)

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      //se a comparação for true, cai dentro desse if => as senhas são igais
      //eu tenho que devolver ao usuário um token de acesso

      //criar um token para o usuário logado
      const token = generateToken(user);

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      //as senhas são diferentes!!
      return res.status(401).json({ msg: "Email ou Senha inválido" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});


export default userRoute;
