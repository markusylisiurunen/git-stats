/**
 * @overview Print statistics by author.
 */

const pad = require('left-pad');
const { sortByColumn, printSection } = require('../helpers');

/**
 * Print statistics by author.
 * @param {Array<Object>} commits Array of commits.
 * @param {Object}        args    Arguments passed to the program.
 */
module.exports = (commits, args) => {
  const byAuthor = {};
  let totalInserted = 0;
  let totalDeleted = 0;

  commits.forEach(commit => {
    if (!byAuthor[commit.author]) {
      byAuthor[commit.author] = { inserted: 0, deleted: 0, total: 0 };
    }

    commit.changes.forEach(change => {
      const { inserted, deleted } = change;

      byAuthor[commit.author].inserted += inserted;
      byAuthor[commit.author].deleted += deleted;
      byAuthor[commit.author].total += inserted - deleted;

      totalInserted += inserted;
      totalDeleted += deleted;
    });
  });

  const data = Object.entries(byAuthor)
    .map(([author, { inserted, deleted, total }]) => {
      let shareOfInserted = !totalInserted ? 0 : inserted / totalInserted * 100;
      let shareOfDeleted = !totalDeleted ? 0 : deleted / totalDeleted * 100;

      shareOfInserted = pad(shareOfInserted.toFixed(1), 5);
      shareOfDeleted = pad(shareOfDeleted.toFixed(1), 5);

      return [
        author,
        inserted.toFixed(0),
        deleted.toFixed(0),
        total.toFixed(0),
        `${shareOfInserted} %  ${shareOfDeleted} %`,
      ];
    })
    .sort(sortByColumn(0));

  printSection(
    'Changes by author',
    ['Author', 'Inserted', 'Deleted', 'Total', 'Share'],
    data
  );
};
