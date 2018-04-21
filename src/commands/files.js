/**
 * @overview Print statistics by file.
 */

const { sortByColumn, printSection } = require('../helpers');

/**
 * Print statistics by file.
 * @param {Array<Object>} commits Array of commits.
 * @param {Object}        args    Arguments passed to the program.
 */
module.exports = (commits, args) => {
  const head = ['File name', 'Inserted', 'Deleted', 'Total'];
  const authors = new Set();
  const byFile = {};

  const HEAD_STATICS = head.length;

  commits.forEach(({ author, changes }) => {
    if (!authors.has(author)) {
      authors.add(author);
      head.push(author);
    }

    changes.forEach(({ file, inserted, deleted }) => {
      let fileName = file.split('/');
      fileName = fileName.slice(fileName.length - 2).join('/');

      if (!byFile[fileName]) {
        byFile[fileName] = { inserted: 0, deleted: 0, total: 0, authors: {} };
      }

      if (!byFile[fileName].authors[author]) {
        byFile[fileName].authors[author] = { inserted: 0, deleted: 0 };
      }

      byFile[fileName].inserted += inserted;
      byFile[fileName].deleted += deleted;
      byFile[fileName].total += inserted - deleted;

      byFile[fileName].authors[author].inserted += inserted;
      byFile[fileName].authors[author].deleted += deleted;
    });
  });

  const data = Object.entries(byFile)
    .map(([file, entry]) => {
      const { inserted, deleted, total } = entry;

      const contributions = head.slice(HEAD_STATICS).map(author => {
        const stats = entry.authors[author];

        if (!stats) return '  0.0 %    0.0 %';

        const { inserted: sInserted, deleted: sDeleted } = stats;
        const { inserted: tInserted, deleted: tDeleted } = entry;

        let shareOfInserted = (!sInserted ? 0 : sInserted / tInserted * 100).toFixed(1);
        let shareOfDeleted = (!sDeleted ? 0 : sDeleted / tDeleted * 100).toFixed(1);

        shareOfInserted = String(shareOfInserted).padStart(5);
        shareOfDeleted = String(shareOfDeleted).padStart(5);

        return `${shareOfInserted} %  ${shareOfDeleted} %`;
      });

      return [
        file,
        inserted.toFixed(0),
        deleted.toFixed(0),
        total.toFixed(0),
        ...contributions,
      ];
    })
    .sort(sortByColumn(0));

  const alignRight = [];

  for (let i = 1; i < head.length; i += 1) alignRight.push(i);

  printSection('Changes by file', head, data, { alignRight });
};
