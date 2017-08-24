const vkController = require('./vkController.js')
module.exports = {
  start: (req, res) => {
    vkController.getAuthCode(req, res);
    //vkController.getAcessToken(req, res, next);
  }
}
