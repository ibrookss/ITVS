const express = require('express');
const routerApi = express.Router();

const pageController = require('./controllers/pageController.js')

routerApi.get('/', pageController.start);

module.exports = routerApi;
