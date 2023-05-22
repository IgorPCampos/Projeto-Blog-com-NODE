const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined) {//Email  não cadastrado
            var salt = bcrypt.genSaltSync(10)//Mais segurança
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((erro) => {
                res.redirect("/")
            })
        } else {
            res.redirect("/admin/users/create")
        }
    })



})

router.post("/users/delete", (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) { //Se for um número | Not a number
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users")
            })
        } else {//Não é um número
            res.redirect("/admin/users")
        }
    } else {//Null
        res.redirect("/admin/users")
    }
})

router.get("/admin/users/edit/:id", (req, res) => {
    var id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/users")
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/users/edit", { user: user })
        } else {
            res.redirect("/admin/users")
        }
    }).catch(erro => {
        res.redirect("/admin/users")
    })

})


router.post("/users/update", (req, res) => {
    var id = req.body.id
    var email = req.body.email
    var password = req.body.password

    var salt = bcrypt.genSaltSync(10)//Mais segurança
    var hash = bcrypt.hashSync(password, salt)

    User.update({ email: email, password: hash }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/users")
    })
})

router.get("/login", (req, res) => { //Mostra a tela de login
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {//Faz de fato o login 
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {//Se existe um usuário com esse e-mail
            //Validar senha
            var correct = bcrypt.compareSync(password, user.password) //Compara a senha digitada com a senha que está no banco de dados
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    })
}) 

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})


module.exports = router