const dotEnv = require('dotenv');

const env = process.env.NODE_ENV; // 'dev' or 'production'

if (process.env.NODE_ENV !== 'production') {
  dotEnv.load();
}

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 8080,
    secret: process.env.DEV_SECRET || 'supersecret',
    jwtExpireTime: parseInt(process.env.DEV_JWT_EXPIRE_TIME, 10) || 86400, // 1 day
    jwtResetPasswordExpireTime:
      parseInt(process.env.DEV_JWT_RESET_PASSWORD_EXPIRE_TIME, 10) || 10800 // 3 hrs
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT, 10) || 27017,
    name: process.env.DEV_DB_NAME || 'mdstbooks',
    username: process.env.DEV_DB_USERNAME || 'admin',
    password: process.env.DEV_DB_PASSWORD || 'admin321'
  },
  mailer: {
    host: process.env.DEV_MAILER_HOST || 'email-smtp.us-east-1.amazonaws.com',
    port: parseInt(process.env.DEV_MAILER_PORT, 10) || 465,
    secure: process.env.DEV_MAILER_SECURE || true,
    auth: {
      user: process.env.DEV_MAILER_USER,
      pass: process.env.DEV_MAILER_PASS
    }
  }
};

const production = {
  app: {
    port: parseInt(process.env.PROD_APP_PORT, 10) || 8080,
    secret: process.env.PROD_SECRET, // config in docker run --env-file
    jwtExpireTime: parseInt(process.env.PROD_JWT_EXPIRE_TIME, 10) || 604800, // 1 week
    jwtResetPasswordExpireTime:
      parseInt(process.env.PROD_JWT_RESET_PASSWORD_EXPIRE_TIME, 10) || 10800 // 3 hrs
  },
  db: {
    host: process.env.PROD_DB_HOST, // config in docker run --env-file
    port: parseInt(process.env.PROD_DB_PORT, 10), // config in docker run --env-file
    name: process.env.PROD_DB_NAME, // config in docker run --env-file
    username: process.env.PROD_DB_USERNAME, // config in docker run --env-file
    password: process.env.PROD_DB_PASSWORD // config in docker run --env-file
  },
  mailer: {
    host: process.env.PROD_MAILER_HOST, // config in docker run --env-file
    port: parseInt(process.env.PROD_MAILER_PORT, 10), // config in docker run --env-file
    secure: process.env.PROD_MAILER_SECURE, // config in docker run --env-file
    auth: {
      user: process.env.PROD_MAILER_USER, // config in docker run --env-file
      pass: process.env.PROD_MAILER_PASS // config in docker run --env-file
    }
  }
};

const config = {
  dev,
  production
};

module.exports = config[env];
