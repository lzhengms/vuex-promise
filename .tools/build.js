process.env.BABEL_ENV = 'production'

var fs = require('fs')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var version = process.env.VERSION || require('../package.json').version

var banner =
  '/*!\n' +
  ' * Vuex-Promise v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Rich Lee\n' +
  ' * Released under the MIT License.\n' +
  ' */'

rollup.rollup({
  entry: 'src/index.js',
  plugins: [babel()]
})
.then(function (bundle) {
  var code = bundle.generate({
    format: 'umd',
    banner,
    moduleName: 'vuexPromise'
  }).code
  return write('dist/index.js', code).then(function () {
    return code
  })
})
.then(function (code) {
  var minified = banner + '\n' + uglify.minify(code, {
    fromString: true,
    output: {
      ascii_only: true
    }
  }).code
  return write('dist/index.min.js', minified)
})
.catch(logError)

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
