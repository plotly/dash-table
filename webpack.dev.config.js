const options = {
    preprocessor: {
        definitions: ['DEV']
    },
    mode: 'development'
};

let config = require('./.config/webpack/base.js')(options);
delete config.externals['prop-types'];

module.exports = config;