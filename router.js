const express = require('express');
const routerApi = express.Router();

const pageController = require('./controllers/pageController.js')
const userController = require('./controllers/userController.js')
const vkController = require('./controllers/vkController.js')

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

routerApi.get('/', pageController.start);
routerApi.get('/signin', userController.signin);
routerApi.post('/upload', multipartMiddleware, vkController.uploadDoc);

module.exports = routerApi;
