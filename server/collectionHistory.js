// Using matb33:collection-hooks package
// https://atmospherejs.com/matb33/collection-hooks
// and deep-diff
// https://github.com/flitbit/diff


var _beforeInsert = function(collection, userId, doc) {
	"use strict";
	var now = new Date();
	doc.createdAt = now;
	doc.updatedAt = now;
	doc.createdBy = userId;
	doc.dateCreated = now;
	History.insert({
		collection: collection,
		userId: userId,
		type: 'insert',
		storedAt: new Date(),
		doc: doc,
	});
};

var _recordAfterRemove = function(collection, userId, doc) {
	"use strict";
	History.insert({
		collection: collection,
		userId: userId,
		type: 'remove',
		storedAt: new Date(),
		doc: doc,
	});
};

var _beforeUpdate = function(collection, doc, fieldNames, modifiers, options) {
	"use strict";
	modifiers.$set.updatedAt= new Date();
};

var _recordAfterUpdate = function(collection, userId, next, prev) {
	"use strict";
	var now = new Date();

	if (Meteor.isServer) {
		/* Find diff */
		var deepDiff = DeepDiff;
		var diff = deepDiff(prev, next);

		/* Store diff */
		History.insert({
			collection: collection,
			userId: userId,
			type: 'update',
			storedAt: now,
			diff: diff,
			doc: {_id : prev._id} ,
		});
	}
};


CollectionHistory = function(historyCollection) {
	"use strict";

	return {
	// Register a collection for auditing/tracking
	auditCollection: function(collection) {

		collection.before.insert(function(userId, doc) {
			_beforeInsert(collection._name, userId, doc);
		});

		collection.after.remove(function(userId, doc) {
			_recordAfterRemove(collection._name, userId, doc);
		});

		collection.after.update(function(userId, doc, fieldNames, modifier, options) {
			_recordAfterUpdate(collection._name, userId, doc, this.previous);
		}, {fetchPrevious: true});
	},

	// Returns a document as it was at a given date.
	// no date returns the document as it is now.
	documentWithDate: function(collection, _id, date) {

		if (!collection || !_id) {
			return;
		}
		if (!date) {
			date = new Date();
		}

		// Find current document
		var document = collection.findOne(_id);
		if (!document) {
			return;
		}

		// Find all of the diffs for this document
		var entries = historyCollection.find({ 'doc._id':_id, type: 'update', 'storedAt': {$gt: date}}, {sort: {storedAt: -1}});
		if (!entries) {
			return;
		}

		// Loop through diffs until diff date < date while reverting changes.
		var deepDiff = Meteor.npmRequire('deep-diff');
		entries.forEach(function(entry, index, array){
			entry.diff.forEach(function(change){
				deepDiff.revertChange(document, true, change);
			});
		});

		return document;
	},

	// Returns the last update item before this date. Null if no earlier diffs.
	// NOTE: diffs are wrapped in a history item!
	diffsWithDate: function(collection, _id, date) {

		if (!collection || !_id || !date) {
			return;
		}
		return historyCollection.findOne({ 'doc._id':_id, type: 'update', 'storedAt': {$lt: date}}, {sort: {storedAt: -1}});
	},

	// Given the mongo id of a diff, find the previous diff
	// NOTE: diffs are wrapped in a history item!
	prevDiff: function(_id) {

		var diff = historyCollection.findOne(_id);
		if (!diff) {
			return;
		}
		// Must have same document id and closest date.
		return historyCollection.findOne({'doc._id': diff.doc._id, 'storedAt': {$lt: diff.storedAt}}, {sort: {storedAt: -1}});
	},

	// Given the mongo id of a diff, find the next diff
	// NOTE: diffs are wrapped in a history item!
	nextDiff: function(_id) {

		var diff = historyCollection.findOne(_id);
		console.log('diff: ', diff);
		if (!diff) {
			return;
		}
		return historyCollection.findOne({'doc._id': diff.doc._id, 'storedAt': {$gt: diff.storedAt}}, {sort: {storedAt: 1}});
	},
};
};
