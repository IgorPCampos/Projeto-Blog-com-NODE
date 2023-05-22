const Sequelize = require("sequelize")
const connection =  require("../database/database")


const Category = connection.define("categorie",{
    title:{
        type: Sequelize.STRING,
        allowNull: false    
    }, slug: {// DESENVOLVIMENTO WEB vira DESENVOLVIMENTO-WEB
        type: Sequelize.STRING,
        allowNull: false 
    }
})



module.exports = Category