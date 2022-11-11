#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const composerRunner = require('../index');

const version = composerRunner.version;
const manager = composerRunner.manager;
const execute = composerRunner.execute;

manager.install(version, () => {
  console.log(`Using Composer version ${version}`);
  execute(version, argv._, () => {
    // always exit when composer finishes is work
    process.exit();
  });
});
