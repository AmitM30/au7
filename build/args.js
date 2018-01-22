
const yargs = require('yargs');

const argv = yargs.argv;
const validBumpTypes = 'major|minor|patch|prerelease'.split('|');
const bump = (argv.bump || 'patch').toLowerCase();

if (validBumpTypes.indexOf(bump) === -1) {
  throw new Error('Unrecognized bump "' + bump + '".');
}

const site = yargs.argv.site || '';
const cdn = yargs.argv.cdn || process.env.CDN_ENV || null;

module.exports = {
  bump: bump,
  depth: parseInt(argv.depth || '0'),
  site: site,
  cdn: cdn ? '//' + cdn + '/' + site : ''
};
