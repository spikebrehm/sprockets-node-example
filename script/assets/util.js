var browserify = require('browserify');
var path = require('path');
var fs = require('fs');
var yargs = require('yargs');
var format = require('util').format;

const isDevelopment = process.env.RAILS_ENV != 'production';

function getBrowserifyBundler(bundlePath) {
  var bundler = browserify({
    entries: bundlePath,
    debug: isDevelopment,
    extensions: ['.hbs'],
  })
  .transform('hbsfy')
  .transform('6to5ify');

  return bundler;
}


/**
 * Get bundle path from commandline args, and throw an error if bundle not found.
 */
function getPathArg() {
  var pathArg = yargs.argv.path;

  if (!pathArg) {
    throw new Error('Must specify a `--path path/to/file` argument.');
  }

  // Support relative path.
  if (pathArg[0] !== '/') {
    pathArg = path.normalize(path.join(process.cwd(), pathArg));
  }

  if (!fs.existsSync(pathArg)) {
    throw new Error(format('File not found: `%s`', pathArg));
  }

  return pathArg;
}


/**
 * log to stderr and exit with failure code.
 * We use Open3.capture3 now in Ruby so we can handle stderr properly.
 */
function logErrorAndExit(e) {
  console.error(e);
  process.exit(1);
}

// export... everything
module.exports = {
  logErrorAndExit: logErrorAndExit,
  getPathArg: getPathArg,
  getBrowserifyBundler: getBrowserifyBundler,
};
