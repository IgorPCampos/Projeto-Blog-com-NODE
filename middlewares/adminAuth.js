function adminAuth(req, res, next) {
    if (req.session.user != undefined) {//Foi gerado a sessão user no navegador do usuário
        next()//Passo do middleware para a rota que o usuário quer acessar
    } else {
        res.redirect("/login")
    }
}

module.exports = adminAuth