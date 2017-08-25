const express = require('express');
const routerApi = express.Router();

const pageController = require('./controllers/pageController.js')
const userController = require('./controllers/userController.js')

routerApi.get('/', pageController.start);
routerApi.get('/signin', userController.signin);

module.exports = routerApi;
