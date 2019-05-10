const options = {
    preprocessor: {
        definitions: ['TEST', 'TEST_COPY_PASTE']
    },
    mode: 'development'
};

const config = require('./.config/webpack/base.js')(options);

config.module.rules.forEach(rule => {
    if (rule.loader) {
        rule.loader = rule.loader.replace('ts-loader', `ts-loader?${JSON.stringify({ transpileOnly: true })}`);
    }
});

module.exports = config;