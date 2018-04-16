/**
 * @overview Git sorcery.
 */

const { promisify } = require('util');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const exec = promisify(childProcess.exec);
const access = promisify(fs.access);

/**
 * Check if cwd is a git repository.
 * @return {Promise<Boolean>} True if cwd is a git repository.
 */
const isRepository = async () => {
  try {
    await access(path.join(process.cwd(), '.git'));
  } catch (err) {
    return false;
  }

  return true;
};

/**
 * Get the full commit log.
 * @return {Promise<Array<Object>>} An array of commits.
 */
const getCommitLog = async () => {
  const BREAK = '---';
  const command = `git log --pretty=tformat:"${BREAK}%an" --numstat`;
  let rawCommits;

  try {
    const result = await exec(command, { cwd: process.cwd() });
    rawCommits = result.stdout.split(BREAK);
  } catch (err) {
    return [];
  }

  return rawCommits
    .map(commit => {
      let [author, _, ...changes] = commit.split('\n');

      if (!author) return null;

      return {
        author,
        changes: changes
          .map(change => {
            let [inserted, deleted, file] = change.split('\t');

            if (!file) return null;

            return {
              file,
              inserted: parseInt(inserted, 10),
              deleted: parseInt(deleted, 10),
            };
          })
          .filter(c => c && !isNaN(c.inserted) && !isNaN(c.deleted)),
      };
    })
    .filter(c => c);
};

module.exports = { isRepository, getCommitLog };
