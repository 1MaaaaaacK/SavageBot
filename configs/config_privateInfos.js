const mysql = require('mysql2');

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
