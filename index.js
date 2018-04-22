#!/usr/bin/env node

const minimist = require('minimist');
const getTable = require('@markusylisiurunen/md-table');
const { isRepository, getCommitLog } = require('./src/git');
const { getIncludesAndExcludes, filterCommits } = require('./src/helpers');
const commands = require('./src/commands');

const help = `
Usage: git-stats [options] <command> [command...]

Commands:

  author  print statistics by author
  files   print statistics by file

Options:

  -h, --help     output usage information
  -i, --include  glob of files to include
  -e, --exclude  glob of files to exclude

Examples:

  $ git-stats author
  $ git-stats -i "**/*.js" -i "*.py" -e "**/config.js" author files
`;

/**
 * Main entry point.
 * @param {Object} args Parsed arguments.
 */
const main = async args => {
  if (args._.length === 0 || args.h || args.help || args._.some(arg => !commands[arg])) {
    console.log(help);
    return;
  }

  if (!await isRepository()) {
    console.log('You are not in a Git repository.');
    return;
  }

  const globs = getIncludesAndExcludes(args);
  const commits = filterCommits(await getCommitLog(), globs);

  args._.forEach(command => commands[command](commits, args));
};

main(minimist(process.argv.slice(2))).catch(err => console.log(err));
