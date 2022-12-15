function isInteressado(req, res, next) {
  if (req.auth.role !== "interessado") {
    return res
      .status(401)
      .json({ msg: "Usuário não autorizado para esta rota!" });
  }

  next();
}

export default isInteressado;
