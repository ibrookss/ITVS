let config = {
  //Порт на котором запускается сервер
  port: 8080,
  //ID приложения вк
  client_id: 6161379,
  //Секретный ключ приложения вк
  secret_key: 'gXN7nljHZjWjK37erkL0',
  //страница на которую редиректится вк после получения кода
  redirect_uri: 'http://localhost:8080/signin',
  //Главная страница
  index_uri: 'http://localhost:8080/',
  //Способ отображения окна авторизации вк
  display: 'popup',
  //Какие данные запрашивать у пользователя
  scope: 'offline,docs',
  //Вид ответов
  response_type: 'code',
}
module.exports = config;
