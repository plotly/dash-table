const options = {
    ts: {
        transpileOnly: true
    },
    preprocessor: {
        definitions: ['TEST', 'TEST_COPY_PASTE']
    },
    mode: 'development'
};

let config = require('./.config/webpack/base.js')(options);
delete config.externals['prop-types'];

module.exports = config;