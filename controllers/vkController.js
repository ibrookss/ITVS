const request = require('request');
const sizeOf = require('image-size');
const Base64 = require('js-base64').Base64;
const fs = require('fs');
const restler = require('restler');
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
          console.log(responseBody.response.upload_url)
          resolve(responseBody.response.upload_url);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveDoc(access_token, file, name, sizes) {
    return new Promise ((resolve, reject) => {
      try {
        let newFile = file.replace('W10=', Base64.encode('{"graffiti":{"width": '+sizes.width+', "height": '+sizes.height+'}}'));
        let url = `https://api.vk.com/method/docs.save?file=${newFile}&title=${name}&access_token=${access_token}&v=5.68`;
        request(url, (error, response, body) => {
          let url = `https://api.vk.com/method/docs.save?file=${file}&title=${name}&access_token=${access_token}&v=5.68`;
          request(url, (error, response, body) => {
            resolve()
          });
        });
        let responseBody;
        console.log(newFile);
      } catch (err) {
        console.log(err)
      }
    })
  },
  uploadDoc(req, res, url) {
    return new Promise ((resolve, reject) => {
      let API = this;
      try {
      //  let url = await this.getUploadServerUrl();
      let file = req.files.document;
        file.mv(`./upload/${file.name}`, function(err) {
          if (err) console.log(err);
          sizeOf(`./upload/${file.name}`, function (err, dimensions) {
            console.log(`Отправляю запрос на ${url}`);
            var formData = {
              file: fs.createReadStream(`./upload/${file.name}`),
            };
            request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
              if (err) {
                return console.error('upload failed:', err);
              }
              let responseBody = JSON.parse(body);
              API.saveDoc(req.session.access_token, responseBody.file, file.name, {width: dimensions.width, height:dimensions.height})
              res.sendStatus(200);
            });
            // Advanced use-case, for normal use see 'formData' usage above

          });
        });
      } catch (err) {
        console.log(err);
      }
     });
  }
}
