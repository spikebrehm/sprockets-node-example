#!/usr/bin/env node
/**
 * A task to build a specific bundle, and stream it to stdout.
 *
 * This script is called by lib/browserify_template.rb to build our .bundle.js
 * files.
 *
 *     ./script/assets/tasks/bundle.js --path /path/to/my/file.bundle.js
 */
var fs = require('fs');
var util = require('../util');

function buildBundle(bundlePath) {
  var bundler = util.getBrowserifyBundler(bundlePath);

  var bundle = bundler.bundle()
    .on('error', util.logErrorAndExit)
    .on('end', function() {
      // We have to append a ; to the end of the bundled output because of
      // issues related to IIFEs right after the source maps.
      process.stdout.write(';\n');
    })
    .pipe(process.stdout);

  return bundle;
}

// entry point
if (require.main === module) {
  buildBundle(util.getPathArg());
}

// export the task
module.exports = buildBundle;
