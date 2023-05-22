const express = require("express")
const router = express.Router()//"Substitui" o app do index.js
const Category = require("../categories/Categorie")
const Article = require("./Article")//Model/tabela
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]//Inclua os dados da category
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
    
})

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
    
})

router.post("/articles/save", adminAuth, (req, res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categorieId: category  
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", adminAuth, (req, res) => {
    var idVar = req.body.id
    if (idVar != undefined) {
        if (!isNaN(idVar)) { //Se for um número | Not a number
            Article.destroy({
                where: {
                    id: idVar
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        } else {//Não é um número
            res.redirect("/admin/articles")
        }
    } else {//Null
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {//Criei a rota que leva para a edição/HTML
    var id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/articles")
    }
    Article.findByPk(id).then(articles => {
        if (articles != undefined) {
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit",{articles: articles, categories: categories})
            })
        } else {
            res.redirect("//admin/articles")
        }
    }).catch(erro => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", adminAuth, (req, res) => {//Editando de fato
    let idVar = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.update({title: title, slug: slugify(title), body: body, categorieId: category}, {//Atualiza o titulo pelo o titulo e o body pelo body que for enviado no form onde o id for igual ao id que vem do form
        where: {
            id: idVar
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(erro => {
        res.redirect("/")
    })
})

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0
    if (isNaN(page) || page == 1) {

    } else {
        offset = (parseInt(page)-1) * 4
    }

    Article.findAndCountAll({
       
        limit: 4,//Limita a quantidade de artigos que vai aparecer
        offset: offset,//Vai mostra do 10º até o 12º 
        /*
        Página 1 = 2 - 3
        Página 2 = 4 - 5
        Página 3 = 6 - 7
        Página 4 = 8 - 9
        */
        order: [['id', 'DESC']]
    }).then(articles => {
        var next
        if (offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
        
    })
})

module.exports = router