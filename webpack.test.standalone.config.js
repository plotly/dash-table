const options = require('./webpack.test.config.js');

options.preprocessor = options.preprocessor || {};
options.preprocessor.variables = options.preprocessor.variables || {};
options.preprocessor.variables.mode = 'eager';

let config = require('./.config/webpack/base.js')(options);
delete config.plugins;

module.exports = config;