# **This project is not in a usable state**

Some of the things listed here have been implemented, some have not. Most will change when I have some more time to come back to this project.

hockeyj85:collection-history
============================

A meteor package that tracks changes to a mongo collection.

** This package is a work in progress and will feature many a breaking change during the near future **

Installation
============

Clone this repo to the ```packages``` directory within your meteor app.


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


API
===

Expect many breaking changes here.

*CollectionHistory*.auditCollection(collection)
-----------------------------------------------
Track ```collection```.


*CollectionHistory*.documentWithDate(collection, _id, date)
-----------------------------------------------------------
Not working.

*CollectionHistory*.diffsWithDate(collection, _id, date)
--------------------------------------------------------
Not working.

*CollectionHistory*.prevDiff(_id)
---------------------------------
Get the diff immediately before _id.
_id is:

```js

{
    // other props
    doc: {
        _id: "a mongo Id"
    }
}

```

*CollectionHistory.nextDiff(_id)
--------------------------------
Get the diff immediately after _id.
