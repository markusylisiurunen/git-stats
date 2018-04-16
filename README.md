![npm version](https://badge.fury.io/js/%40markusylisiurunen%2Fgit-stats.svg)
![npm dependencies](https://david-dm.org/markusylisiurunen/git-stats.svg)
![github issues](https://img.shields.io/github/issues/markusylisiurunen/git-stats.svg)
![license](https://img.shields.io/github/license/markusylisiurunen/git-stats.svg)

## Install

```shell
$ npm i -g @markusylisiurunen/git-stats
```

or with npx

```shell
$ npx @markusylisiurunen/git-stats author
```

## Usage

```
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
```

## License

MIT
