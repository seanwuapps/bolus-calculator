module.exports = {
	globDirectory: '.output',
	globPatterns: [
		'**/*.{json,js,css,woff2,woff,ttf,eot,png,mp3,ico,webmanifest,mjs}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};