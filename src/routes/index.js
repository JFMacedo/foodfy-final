const express = require('express')
const routes = express.Router()

const site = require('./site')
const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use(site)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes')
})

module.exports = routes