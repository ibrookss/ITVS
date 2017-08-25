const vkController = require('./vkController.js')
module.exports = {
  signin: (req, res) => {
    vkController.getAuthCode(req, res);
    //vkController.getAcessToken(req, res, next);
  }
}

//-> Получить код
//-> Переадресовать обратно на сигн ин
//-> Получить ацесс токен
//-> Переадресовать на главную
