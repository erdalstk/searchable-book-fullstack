module.exports = Object.freeze({
  FB_GRAPH_API_URL: 'https://graph.facebook.com/me?access_token=',

  // messages
  STR_SERVER_ERROR: 'Server Error',
  STR_USER_NOT_FOUND: 'User not found',
  STR_FB_TOKEN_ERROR: 'Can not verify Facebook Access Token',

  // upload stuffs
  STATIC_UPLOAD_URI_PREFIX: '/static/upload/',
  STATIC_UPLOAD_PATH: './static/upload/',

  // user levels
  USER_LEVEL_BASIC: 4,
  USER_LEVEL_ADVANCE: 3,
  USER_LEVEL_MOD: 2,
  USER_LEVEL_ADMIN: 1,
  USER_LEVEL_SUPERADMIN: 0,

  // Api access Token
  API_ACCESS_TOKEN: {
    WEB_APP: 'mdstbooks-react-app-123456',
    BOT_APP: 'mdstbooks-bot-app-123456'
  }
});
