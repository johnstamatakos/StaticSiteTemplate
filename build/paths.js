var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
	root: appRoot,
	html: [
		appRoot + "**/*.html",
    "!" + appRoot + "**/_*.html"
	],
	sass: [
    appRoot + "**/*.scss",
    appRoot + "**/*.css",
  ],
  img: appRoot + "**/*.{ico,png,jpg}",
  js: appRoot + "**/*.bundle.js",
  output: outputRoot
}
