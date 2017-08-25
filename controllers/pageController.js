const vkController = require('./vkController.js')
module.exports = {
  start: (req, res) => {
    res.render('index', {code: req.session.code || 'Не авторизирован', access_token: req.session.access_token  || 'Не авторизирован', user_id: req.session.user_id  || 'Не авторизирован'});
  }
}
