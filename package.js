Package.describe({
	name: 'hockeyj85:collection-history',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	summary: '',
	// URL to the Git repository containing the source code for this package.
	git: '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Npm.depends({
	"deep-diff": "0.2.0"
});

Package.onUse(function(api) {
	api.versionsFrom('1.0.3.1');

	api.use('underscore');

	api.addFiles([
		'hockeyj85:collection-history.js',
		'server/collectionHistory.js',
		'client/collectionHistoryHelpers.js',
//		'.npm/package/node_modules/deep-diff/index.js',
		'lib/deep-diff.js',
	]);

	api.export([
		'CollectionHistory',
		'CollectionHistoryHelpers'
	]);
});

Package.onTest(function(api) {
	api.use('tinytest');
	api.use('hockeyj85:collection-history');
	api.addFiles('hockeyj85:collection-history-tests.js');
});
