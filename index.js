#!/usr/bin/env node

const minimist = require('minimist');
const getTable = require('@markusylisiurunen/md-table');
const { isRepository, getCommitLog } = require('./src/git');
const { getIncludesAndExcludes, filterCommits, isValidArgument } = require('./src/helpers');
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
  -s, --since    output stats from given start date (and optional time)

Examples:

  $ git-stats author
  $ git-stats -i "**/*.js" -i "*.py" -e "**/config.js" -s "2018-04-20 04:20" author files
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

  const since = args.s || args.since;
  if (since && !isValidArgument.since(since)) {
    console.log('Error: the --since argument must be formatted YYYY-MM-DD or "YYYY-MM-DD hh-mm" \n');
    return;
  }

  if (!await isRepository()) {
    console.log('You are not in a Git repository.');
    return;
  }

  const globs = getIncludesAndExcludes(args);

  const commits = filterCommits(await getCommitLog(since), globs);

  args._.forEach(command => commands[command](commits, args));
};

main(minimist(process.argv.slice(2))).catch(err => console.log(err));
