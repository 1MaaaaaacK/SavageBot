const mysql = require('mysql');

const botConfig = {
    prefix: '!',
    token: '',
};

const panelApiKey = {
    api: '',
};

const connection = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database: '',
});

module.exports = {
    botConfig,
    connection,
    panelApiKey,
};
