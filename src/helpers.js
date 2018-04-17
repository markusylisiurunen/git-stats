/**
 * @overview Helper functions.
 */

const anymatch = require('anymatch');
const getTable = require('@markusylisiurunen/md-table');

/**
 * Conditionally wrap a value into an array.
 * @param  {Mixed} value Value to wrap.
 * @return {Array}       Wrapped value or original array.
 */
const wrap = value => (Array.isArray(value) ? value : [value]);

/**
 * Get include and exclude globs.
 * @param  {Object} args Parsed arguments.
 * @return {Object}      Includes and excludes.
 */
const getIncludesAndExcludes = args => ({
  include: [...wrap(args.i || []), ...wrap(args.include || [])],
  exclude: [...wrap(args.e || []), ...wrap(args.exclude || [])],
});

/**
 * Filter commits based on include and exclude globs.
 * @param  {Array<Object>} commits Commit array.
 * @param  {Object}        options Options object.
 * @return {Array<Object>}         Filtered array of commits.
 */
const filterCommits = (commits, { include, exclude }) =>
  commits
    .map(commit => {
      let { author, changes } = commit;

      changes = changes.filter(change => {
        if (include.length && !anymatch(include, change.file)) {
          return false;
        }

        return !anymatch(exclude, change.file);
      });

      if (!changes.length) return null;

      return { author, changes };
    })
    .filter(c => c);

/**
 * Sort an array of arrays by column.
 * @param  {Number}   column Column index to sort by.
 * @return {Function}        Sorter function.
 */
const sortByColumn = column => (a, b) => {
  if (a[column] < b[column]) {
    return -1;
  } else if (a[column] > b[column]) {
    return 1;
  }

  return 0;
};

/**
 * Print a section with a title and a table.
 * @param {String}       title   Title of the section.
 * @param {Array}        head    Table head row.
 * @param {Array<Array>} data    Table body rows.
 * @param {Object}       options Optional options to pass to md-table.
 */
const printSection = (title, head, data, options = {}) => {
  process.stdout.write(`\n   ${title}:\n`);
  process.stdout.write(
    getTable(head, data, {
      x: 3,
      y: 1,
      colors: { head: '#eecc99', border: '#555' },
      ...options,
    })
  );
};

module.exports = {
  getIncludesAndExcludes,
  filterCommits,
  sortByColumn,
  printSection,
};
