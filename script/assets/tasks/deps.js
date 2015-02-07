#!/usr/bin/env node
var concat = require('concat-stream');
var util = require('../util');

/**
 * List a bundle's dependencies using Browserify to STDOUT.
 *
 *    ./script/assets/tasks/deps.js --path /path/to/my/file.bundle.js
 */
function dependencies(bundlePath) {
  var bundler = util.getBrowserifyBundler(bundlePath);

  // Extract the dependencies of a given bundle and print each as a line to
  // STDOUT.
  //
  // Inspired by Browserify's commandline utility:
  // https://github.com/substack/node-browserify/blob/47c6933e711567de761c73fe81165223c7873433/bin/cmd.js#L46-L51
  bundler.pipeline.get('deps').push(
    concat(function(data) {
      // Buffer the dependencies so we can wait to output to STDOUT at the end
      // of the task, in case there's an error resolving dependencies.
      data.forEach(function(datum) {
        console.log(datum.file || datum.id);
      });
    })
  );

  bundler.bundle()
    .on('error', util.logErrorAndExit);
}

// entry point
if (require.main === module) {
  dependencies(util.getPathArg());
}

// export task
module.exports = dependencies;
