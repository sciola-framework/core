const https = require('https');
const path = require('path');
const fs = require('fs');

const COMPOSER_PATH = 'https://getcomposer.org/download';
const COMPOSER_FILENAME = 'composer.phar';

function getVersionPath(version) {
  return path.join(__dirname, '..', 'bin/composer.' + version + '.phar');
}

function exists(version, cb) {
  const installPath = getVersionPath(version);
  fs.stat(installPath, (err, stats) => {
    if (err) {
      cb(null, false);
      return;
    }
    cb(null, stats.isFile());
  });
}

function install(version, cb) {
  exists(version, (err, fileExists) => {
    if (fileExists) {
      if (cb) {
        cb();
      }
      return;
    }

    console.log('Downloading... Composer version ' + version);
    const installPath = getVersionPath(version);
    const file = fs.createWriteStream(installPath);
    const downloadPath = [COMPOSER_PATH, version, COMPOSER_FILENAME].join('/');
    const result = https.get(downloadPath, (res) => {
      res.pipe(file)
        .on('close', (writeError) => cb(writeError));
    });
    result.on('error', console.error.bind(console));
  });
}

module.exports = {
  install,
  exists,
  getVersionPath,
};
