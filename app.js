const express = require('express');
const app = express();

const exhb = require('express-handlebars');

const router = require('./router.js');
const config = require('./config.js');

app.use('/public',express.static('./public'));
app.engine('handlebars', exhb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(router)
app.listen(config.port, (err) => {
  !err
  ? console.log(`Сервер успешно запущен на ${config.port} порту`)
  : console.log(`Сервер не смог запуститься из за ошибки ${err}`)
});
