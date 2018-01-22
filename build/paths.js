
var appRoot = 'src/';
var outputRoot = 'dist/';
var exportSrvRoot = 'export/';
var sharedRoot = 'shared/';
var bowerRoot = 'bower_components/';
var nmRoot = 'node_modules/';
var wwwRoot = 'www/';

module.exports = {
  www: wwwRoot,
  root: appRoot,
  shared: sharedRoot,
  bower: bowerRoot,
  nm: nmRoot,
  mainJS: '**/*.js',
  css: appRoot + '**/*.css',
  scss:  '**/*.scss',
  style: 'styles/**/*.css',
  jsons: 'jsons/**/*.json',
  output: outputRoot,
  exportSrv: exportSrvRoot,
  html: '**/*.html',
  source: sharedRoot + 'source/**/*.js',
  components: sharedRoot + 'components/**/*.html',
  translations: sharedRoot + 'locales/**/*.json',
  fonts: sharedRoot + 'fonts/**/*.*',
  images: sharedRoot + 'images/**/*.*'
};
