const express = require("express")
const router = express.Router()//"Substitui" o app do index.js
const Category = require("./Categorie")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
})

router.post("/categories/save", adminAuth,(req, res) =>{
    var titleVar = req.body.title//pegando os dados do form
    if (titleVar != undefined) {
        Category.create({
            title: titleVar,
            slug: slugify(titleVar)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect("/admin/categories/new")
    }
})

router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories})
    })
    
})

router.post("/categories/delete", adminAuth, (req, res) => {
    var idVar = req.body.id
    if (idVar != undefined) {
        if (!isNaN(idVar)) { //Se for um número | Not a number
            Category.destroy({
                where: {
                    id: idVar
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        } else {//Não é um número
            res.redirect("/admin/categories")
        }
    } else {//Null
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", adminAuth,(req, res) => {//Criei a rota que leva para a edição
    var id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit",{category: category})
        } else {
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", adminAuth, (req, res) => {//Editando de fato
    let idVar = req.body.id
    let title = req.body.title

    Category.update({title: title, slug: slugify(title)}, {//Atualiza o titulo pelo o titulo que for enviado no form onde o id for igual ao id que vem do form
        where: {
            id: idVar
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router