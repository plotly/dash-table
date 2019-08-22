const resolveImportSource = `\
Object.defineProperty(__webpack_require__, 'p', {
    get: (function () {
        var url = Array.from(document.getElementsByTagName('script')).slice(-1)[0].src.split('/').slice(0, -1).join('/') + '/';

        return function() {
            return url;
        };
    })()
});`

class WebpackDashDynamicImport {
    apply(compiler) {
        compiler.hooks.compilation.tap('WebpackDashDynamicImport', compilation => {
            compilation.mainTemplate.hooks.requireExtensions.tap('WebpackDashDynamicImport > RequireExtensions', (source, chunk, hash) => {
                return [
                    source,
                    resolveImportSource
                ]
            });
        });
    }
}

module.exports = WebpackDashDynamicImport;