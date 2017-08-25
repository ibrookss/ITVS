const vkController = require('./vkController.js')
module.exports = {
  signin: async (req, res) => {
    await vkController.getAuthCode(req, res);
    await vkController.getAcessToken(req, res);
    await vkController.getUploadServerUrl(req, res);
  }
}

//-> Получить код
//-> Переадресовать обратно на сигн ин
//-> Получить ацесс токен
//-> Переадресовать на главную
