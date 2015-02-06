
hockeyj85:collection-history
============================

A meteor package that tracks changes to a database.

Installation
============

```bash
meteor add hockeyj85:collection-history
```

Usage
=====

```js

// Set up a database to store the changes in.
var HistoryDatabase = new Mongo.Collection('historyOfChanges');

// Create a new tracker that will use this database for storing its changes.
var HistoryTracker = new collectionHistory(HistoryDatabase);

// Watch a database and record activity to it.
var importantDatabase = new Mongo.Collection('importantInformation');
HistoryTracker.auditCollection(importantDatabase);


```

Getting changes out
===================

This package is incomplete, you can view the stored information using mongo queries on the collection which the history is stored in.
An api for browsing changes is planned, but it is 3-6 months away.
