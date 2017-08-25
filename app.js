const express = require('express');
const app = express();

const exhb = require('express-handlebars');
const session = require('express-session')


const router = require('./router.js');
const config = require('./config.js');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(session({ secret: 'GkGjsYUdfLdsB', cookie: { maxAge: 600000 }, resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/public',express.static('./public'));
app.engine('handlebars', exhb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(router)
app.listen(config.port, (err) => {
  !err
  ? console.log(`Сервер успешно запущен на ${config.port} порту`)
  : console.log(`Сервер не смог запуститься из за ошибки ${err}`)
});
