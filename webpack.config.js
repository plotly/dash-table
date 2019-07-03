let config = require('./.config/webpack/base.js')();
config.externals['prop-types'] = {
    root: 'PropTypes',
    commonjs2: 'prop-types',
    commonjs: 'prop-types',
    amd: 'prop-types'
};

module.exports = config;