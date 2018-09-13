const env = process.env.NODE_ENV; // 'dev' or 'production'

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 8080,
    secret: process.env.DEV_SECRET || 'supersecret',
    jwtExpireTime:process.env.DEV_JWT_EXPIRE_TIME || 604800 // 5 mins
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || 'mdstbooks',
    username: process.env.DEV_DB_USERNAME || 'admin',
    password: process.env.DEV_DB_PASSWORD || 'admin321'
  }
};

const production = {
  app: {
    port: parseInt(process.env.PROD_APP_PORT) || 8080,
    secret: process.env.PROD_SECRET || 'supersecret',
    jwtExpireTime:process.env.PROD_JWT_EXPIRE_TIME || 604800 // 1 week
  },
  db: {
    host: process.env.PROD_DB_HOST || 'haoict.com',
    port: parseInt(process.env.PROD_DB_PORT) || 27017,
    name: process.env.PROD_DB_NAME || 'mdstbooks',
    username: process.env.PROD_DB_USERNAME || 'admin',
    password: process.env.PROD_DB_PASSWORD || 'admin321'
  }
};

const config = {
  dev,
  production
};

module.exports = config[env];
