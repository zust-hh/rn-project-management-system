const jwt = require('jsonwebtoken')
const APP_SECRET = 'Taiwu-is-huhao'

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  return null;
}

module.exports = {
  APP_SECRET,
  getUserId,
}