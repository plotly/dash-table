const wp = require('cypress-webpack-preprocessor-v5');

module.exports = on => {
    const webpackOptions = require('../../../webpack.test.standalone.config.js');

    const options = {
        webpackOptions: {
            module: webpackOptions.module,
            resolve: webpackOptions.resolve
        }
    };

    on('file:preprocessor', wp(options))

    on('before:browser:launch', (browser = {}, args) => {
        if (browser.name === 'chrome') {
            // ^ make sure this is your browser name, you may
            // be using 'canary' or 'chromium' for example, so change it to match!
            args.push('--proxy-bypass-list=<-loopback>');
            return args;
        }
    });
};