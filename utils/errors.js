const BadRequestError = require('../errors/bad_req_error');
const NotFoundError = require('../errors/not_found_error');
const NoAuthError = require('../errors/no_auth_error');
const EmailError = require('../errors/email_error');
const AuthError = require('../errors/auth_error');
const ServerError = require('../errors/server_error');

module.exports.currentError = (err) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    throw new BadRequestError('Указаны некорректные данные');
  } else if (err.name === 'NotFoundError') {
    throw new NotFoundError('Страница не найдена');
  } else if (err.name === 'NoAuthError') {
    throw new NoAuthError('Недостаточно прав для выполнения операции');
  } else if (err.name === 'EmailError') {
    throw new EmailError('Такой email уже существует');
  } else if (err.name === 'AuthError') {
    throw new AuthError('Необходима авторизация');
  } else {
    throw new ServerError('Ошибка на сервере');
  }
};
