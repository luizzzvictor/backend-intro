
function isPrestador(req, res, next) {

    if (req.auth.role !== "prestador") {
        return res.status(401).json({msg: "Usuário não autorizado para esta rota!"})
    }

    next()
}

export default isPrestador