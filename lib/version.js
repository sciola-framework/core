'use strict';

const path = require('path');

// find the right version
const pkg = require('../package.json');
let cwdPkg;
try {
  const packageFolder = path.join(process.cwd(), 'package.json');
  cwdPkg = require(packageFolder);
} catch (e) { /* do nothing */ }

// default version is defined from this repository
let version = pkg.engines.composer;
// try to override the version if defined in the cwd package
if (cwdPkg && cwdPkg.engines && cwdPkg.engines.composer) {
  version = cwdPkg.engines.composer;
}

module.exports = function getVersion() {
  return version;
};
