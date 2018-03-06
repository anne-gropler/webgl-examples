/**
 * This custom script is used to build/copy example sources for distribution:
 * - copy specific assets such as style sheets or scripts (either 3rd party or custom ones)
 * - compile specific pug templates and render to dist path
 */

const watch = process.argv.indexOf('--watch') > 1;

const fs = require('fs');
const glob = require("glob");
const path = require('path');
const pug = require('pug');

const baseDir = './website';
const distDir = './dist';

const assets = [
    'css/*.css',
    'js/*.js',
    'img/*.{svg,png}',
    'fonts/*',
    '*.{svg,png,ico,xml,json}'];
const entries = [
    'test-renderer.pug'
];

const copy = require('./copy.js');

var build_pending = false;
function build() {

    copy('./node_modules/webgl-operate/dist', distDir + '/js', ['webgl-operate.{js,js.map}']);
    copy(baseDir, distDir, assets);

    entries.forEach((entry) => {
        const src = path.join(baseDir, entry);
        const dst = path.join(distDir, path.basename(entry, path.extname(entry)) + '.html');
        if (!fs.existsSync(src)) {
            console.log('skipped:', entry);
            return;
        }
        const html = pug.renderFile(src);
        fs.writeFileSync(dst, html);
        console.log('emitted:', dst);
    });

    build_pending = false;
}


build(); // trigger initial build

if (watch) {
    fs.watch(baseDir, { recursive: true }, function () {
        if (build_pending) {
            return;
        }
        build_pending = true;
        setTimeout(build, 100);
    });
}

