const spawn = require('child_process').spawn;
const manager = require('./downloadManager');

module.exports = function execute(version, args, cb) {
  const versionPath = manager.getVersionPath(version);
  const composer = spawn('php', [versionPath].concat(args));

  composer.stdout.pipe(process.stdout);
  composer.stderr.pipe(process.stderr);
  process.stdin.pipe(composer.stdin);

  if (cb) {
    composer.on('exit', () => { cb(); });
  }
};
