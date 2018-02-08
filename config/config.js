//load .env config (doenv library) process.env.CONFIG_NAME
require('dotenv').load();

const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3000,
        botToken: process.env.BOT_TOKEN
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME || 'db'
    }
};
const test = {
    app: {
        port: parseInt(process.env.TEST_APP_PORT) || 3000
    },
    db: {
        host: process.env.TEST_DB_HOST || 'localhost',
        port: parseInt(process.env.TEST_DB_PORT) || 27017,
        name: process.env.TEST_DB_NAME || 'test'
    }
};

const config = {
    dev,
    test
};
//константа конфиг принимает значение переменной окружения которая прописанна в файле .env
//установляваем библитеку dote.env для работы с переменными окружения
module.exports = config[env];