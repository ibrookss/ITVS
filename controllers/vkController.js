const request = require('request');

module.exports = {
  client_id: 6161379,
  secret_key: 'gXN7nljHZjWjK37erkL0',
  redirect_uri: 'http://localhost:8080/signin',
  index_uri: 'http://localhost:8080/',
  display: 'popup',
  scope: 'offline,docs',
  response_type: 'code',
  //Получает code и добавляет в сессию
  getAuthCode(req, res){
    //Если нет кода, то получаем его
    return new Promise((resolve, reject) => {
      try {
        if (!req.query.code || req.session.code == req.query.code) {
          let url = `https://oauth.vk.com/authorize?client_id=${this.client_id}&display=${this.display}&redirect_uri=${this.redirect_uri}&scope=${this.scope}&response_type=${this.response_type}&v=5.52`;
          //Если есть в сессии код, нам незачем получать новй
          return res.redirect(url);
        } else {
          req.session.code = req.query.code;
          console.log('Код получен');
          resolve(req.session.code);
        }
      } catch (err) {
        reject(err)
      }
    });
  },
  //Получает access_token, user_id и добавляет в сессию
  getAcessToken(req, res) {
    return new Promise((resolve, reject) => {
      try {
        let url = `https://oauth.vk.com/access_token?client_id=${this.client_id}&client_secret=${this.secret_key}&redirect_uri=${this.redirect_uri}&code=${req.session.code}`;
        let responseBody;
        request(url, (error, response, body) => {
          responseBody = JSON.parse(body);
          req.session.access_token = responseBody.access_token;
          req.session.user_id = responseBody.user_id;
          console.log('Токен получен')
          resolve();
          res.redirect(this.index_uri);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  //Возвращает ссылку для загрузочного сервера
  getUploadServerUrl(req, res) {
    return new Promise((resolve, reject) => {
      try {
        let url = `https://api.vk.com/method/docs.getUploadServer?access_token=${req.session.access_token}&v=5.68`;
        let responseBody;
        request(url, (error, response, body) => {
          responseBody = JSON.parse(body);
          resolve(responseBody.response.upload_url);
        });
      } catch (err) {
        reject(err)
      }
    });
  },
  saveDoc(req, res) {
    return new Promise ((resolve, reject) => {

    })
  },
  uploadDoc(req, res) {
    return new Promise ((resolve, reject) => {
      console.log(req.files)
      res.sendStatus(200);
    })
  }
}
