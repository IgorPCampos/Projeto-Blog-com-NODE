const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Categorie")

const Article = connection.define("article",{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {// DESENVOLVIMENTO WEB vira DESENVOLVIMENTO-WEB
        type: Sequelize.STRING,
        allowNull: false 
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)//Uma categoria tem muitos artigos
Article.belongsTo(Category)//Um artigo pertence a uma categoria



module.exports = Article