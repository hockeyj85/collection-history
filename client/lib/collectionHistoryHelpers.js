
// This contains a few useful helpers that you might want on the client.
CollectionHistoryHelpers = {
	prevDiff: function(_id, historyCollection) {
		var diff = historyCollection.findOne({_id: _id});
		if (!diff) {
			return;
		}
		// Must have same document id and closest date.
		return historyCollection.findOne({'doc._id': diff.doc._id, 'storedAt': {$lt: diff.storedAt}}, {sort: {storedAt: -1}});
	},

	// Given the mongo id of a diff, find the next diff
	// NOTE: diffs are wrapped in a history item!
	nextDiff: function(_id, historyCollection) {

		var diff = historyCollection.findOne({_id: _id});
		if (!diff) {
			return;
		}
		return historyCollection.findOne({'doc._id': diff.doc._id, 'storedAt': {$gt: diff.storedAt}}, {sort: {storedAt: 1}});
	},
};