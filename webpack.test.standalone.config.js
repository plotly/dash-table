let config = require('./webpack.test.config.js');
delete config.plugins;

module.exports = config;