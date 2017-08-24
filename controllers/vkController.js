const request = require('request');

module.exports = {
  client_id: 6155225,
  secret_key: 'V9qA3NxPdKVyyGitQ6W5',
  redirect_uri: 'http://localhost:8080/',
  display: 'popup',
  scope: 'offline,docs',
  response_type: 'code',
  getAuthCode(req, res){
    //Если нет кода, то получаем его
    if (!req.query.code || req.session.code == req.query.code) {
      let url = `https://oauth.vk.com/authorize?client_id=${this.client_id}&display=${this.display}&redirect_uri=${this.redirect_uri}&scope=${this.scope}&response_type=${this.response_type}&v=5.52`;
      //Если есть в сессии код, нам незачем получать новй
      return res.redirect(url);
    } else {
      req.session.code = req.query.code;
      this.getAcessToken(req, res);
    }
  },
  getAcessToken(req, res) {
    let url = `https://oauth.vk.com/access_token?client_id=${this.client_id}&client_secret=${this.secret_key}&redirect_uri=${this.redirect_uri}&code=${req.session.code}`;
    let responseBody;
    request(url, (error, response, body) => {
      responseBody = JSON.parse(body);
      req.session.access_token = responseBody.access_token;
      req.session.user_id = responseBody.user_id;
      console.log(req.session)
      res.render('index', {code: req.session.code, access_token: req.session.access_token, user_id: req.session.user_id});
    });
  }
}
