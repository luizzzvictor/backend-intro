function isVitima(req, res, next) {
  if (req.auth.role !== "vitima" || "representante") {
    return res
      .status(401)
      .json({ msg: "Usuário não autorizado para esta rota!" });
  }

  next();
}

export default isVitima;
