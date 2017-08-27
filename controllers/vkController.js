const request = require('request');
const sizeOf = require('image-size');
const Base64 = require('js-base64').Base64;
const fs = require('fs');
const config = require('../config.js');
module.exports = {
    getAuthCode(req, res){
        return new Promise((resolve, reject) => {
            try {
                if (!req.query.code || req.session.code == req.query.code) {
                    let url =
                    'https://oauth.vk.com/authorize?'
                    +'client_id='
                    +config.client_id
                    +'&display='
                    +config.display
                    +'&redirect_uri='
                    +config.redirect_uri
                    +'&scope='
                    +config.scope
                    +'&response_type='
                    +config.response_type
                    '&v=5.52';

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
                let url =
                'https://oauth.vk.com/access_token?'
                +'client_id='
                +config.client_id
                +'&client_secret='
                +config.secret_key
                +'&redirect_uri='
                +config.redirect_uri
                +'&code='
                +req.session.code;

                let responseBody;
                request(url, (error, response, body) => {
                    responseBody = JSON.parse(body);
                    req.session.access_token = responseBody.access_token;
                    req.session.user_id = responseBody.user_id;
                    console.log('Токен получен')
                    resolve();
                    res.redirect(config.index_uri);
                });
            } catch (err) {
                reject(err);
            }
        });
    },
    //Возвращает ссылку для загрузочного сервера
    getUploadServerUrl(access_token) {
        return new Promise((resolve, reject) => {
            try {
                let url = `https://api.vk.com/method/docs.getUploadServer?access_token=${access_token}&v=5.68`;
                let responseBody;
                request(url, (error, response, body) => {
                    responseBody = JSON.parse(body);
                    if (responseBody.response && responseBody.response.upload_url) {
                        resolve({status: 1, url: responseBody.response.upload_url});
                    }
                });
            } catch (err) {
                reject({status: 0, message: err});
            }
        });
    },
    //СЮДА В ПАРАМЕТРЫ КИНУТЬ КАПЧУ И ПРОВЕРЯТЬ, ЕСЛИ ОНА ЕСТЬ ТО ВСТАВИТЬ В ДОКУМЕНТ, ЕСЛИ НЕТ ТО НЕТ
    saveDoc(access_token, file, name, sizes, captcha) {
        return new Promise (async (resolve, reject) => {
            try {
                //Перезаписываем конец строки в base64
                let newFile = file.replace('W10=', Base64.encode('{"graffiti":{"width": '+sizes.width+', "height": '+sizes.height+'}}'));
                //Сохраняем через VK API с новым файлом, т.к меняли вручную вылетит ошибка\

                captcha = JSON.parse(captcha);
                console.log(captcha);
                let url = `https://api.vk.com/method/docs.save?file=${newFile}&title=${name}&access_token=${access_token}&v=5.68&captcha_sid=${captcha.captcha_sid}&captcha_key=${captcha.captcha_key}`;
                await request(url, (error, response, body) => {
                    console.log('Первая попытка загрузки - неудача');
                });
                url = `https://api.vk.com/method/docs.save?file=${file}&title=${name}&access_token=${access_token}&v=5.68&captcha_sid=${captcha.captcha_sid}&captcha_key=${captcha.captcha_key}`;
                await request(url, (error, response, body) => {
                    //Сделать капчу
                    responseBody = JSON.parse(body);
                    if (responseBody.error && responseBody.error.error_code == 6) {
                        resolve({status: 0, error: responseBody.error,  message: 'Слишком много запросов'});
                    }
                    if (responseBody.error && responseBody.error.error_code == 14) {
                        resolve({status: 0, error: responseBody.error, message: 'Капча'});
                    }
                    console.log(responseBody);
                    resolve({status: 1});
                });
            } catch (err) {
                reject({status: 0, message: err});
                console.log(err);
            }
        })
    },
    uploadDoc(req, res, url) {
        console.log("______________________________________________________");
        console.log(req.body);
        console.log(req.query);
        console.log(req.files);
        console.log("______________________________________________________");
        return new Promise ((resolve, reject) => {
            //Объявляем АПИ что бы обратиться к нему далее в коде
            let API = this;
            try {
                let file = req.files.document;
                //Проверяем mimetypes
                if (file.mimetype == 'image/gif' ||
                    file.mimetype == 'image/png' ||
                    file.mimetype == 'image/jpeg') {
                    //Сохраняем файл в папку
                    file.mv(`./upload/${file.name}`, function(err) {
                        if (err) console.log(err);
                        //Получаем высоту и ширину картинки
                        sizeOf(`./upload/${file.name}`, function (err, dimensions) {
                            console.log(`Отправляю запрос на ${url}`);
                            //Формируем multipart/form-data post запрос
                            let formData = {
                                file: fs.createReadStream(`./upload/${file.name}`),
                            };
                            request.post({url:url, formData: formData}, async function optionalCallback(err, httpResponse, body) {
                                if (err) {
                                    return console.error('upload failed:', err);
                                }
                                let responseBody = JSON.parse(body);
                                console.log(responseBody)
                                //Вызываем метод сохранения документа
                                let apiRequest = await API.saveDoc(req.session.access_token,
                                                                   responseBody.file,
                                                                   file.name,
                                                                   {
                                                                       width: dimensions.width,
                                                                       height:dimensions.height
                                                                   },
                                                                   req.body.captcha);
                                apiRequest.status == 1
                                    ? res.json({status: 1, message: 'Ваш новый стикер уже в документах (:'}).status(200)
                                    : res.json({status: 0, error: apiRequest.error,  message: apiRequest.message}).status(500);
                            });
                        });
                    });
                } else {
                    res.json({status: 0, message: 'Формат какой то левый'}).status(500);
                }
            } catch (err) {
                console.log(err);
            }
         });
    }
}
