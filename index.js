const express = require("express")
const app = express()
const bodyParser = require("body-parser")
require("dotenv").config();
const connection = require("./database/database")
const session = require("express-session")

const catergoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const userController = require("./user/UserController")

const Article = require("./articles/Article")
const Category = require("./categories/Categorie")
const User = require("./user/User")
//view engine
app.set("view engine", "ejs")

//Session
app.use(session({
    secret: "qualquerCoisa", cookie: { maxAge: 30000000 }

}))

//Static
app.use(express.static('public'))

//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())//Aceita dados JSON tbm

//Database
connection.authenticate()
    .then(() => {
        console.log("Conexão com o banco de dados feita")
    }).catch((error) => {
        console.log(error)
    })

//Posso definir um prefixo para todas as rotas categories
app.use("/", catergoriesController)
app.use("/", articlesController)
app.use("/", userController)




app.get("/", (req, res) => {
    Article.findAll({ order: [['id', 'DESC']], limit: 4 })
        .then(articles => {
            Category.findAll().then(categories => {
                res.render("index", { articles: articles, categories: categories })//A categories é pq dentro do index.ejs eu chamo a homenavbar que precisa dela para funcionar
            })
        })
})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories })//A categories é pq dentro do article.ejs eu chamo a homenavbar que precisa dela para funcionar
            })
        } else {
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]//Inclua nessa busca todos os artigos que fazem parte dessa categoria
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })//Eu tenho que chamar o articles de novo sempre que eu precisar renderizar o index em outra rota || A categories é pq dentro do article.ejs eu chamo a homenavbar que precisa dela para funcionar
            })
        } else {
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
    })
})

const port = process.env.PORT
app.listen(port, (erro) => {
    if (erro) {
        console.log(erro)
    } else {
        console.log("Aplicativo iniciado")
    }
})