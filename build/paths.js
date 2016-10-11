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
  video: appRoot + "**/*.{mp4,webm}",
  js: appRoot + "**/*.bundle.js",
  pdf: appRoot + "**/*.pdf",
  output: outputRoot
}
