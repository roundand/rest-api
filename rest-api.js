var express = require('express');
var mongoskin = require('mongoskin');

var app = express();
app.use(express.bodyParser());

var db = mongoskin.db('localhost:27017/test', {safe: true});

app.param('collectionName', function(req, res, next, collectionName){
	req.collection = db.collection(collectionName);
	return next();
});									// app.param

app.get('/', function(req, res){
	res.send('please send a collection path, eg /collection/messages');
});									// app.get

app.get('/collections/:collectionName', function(req, res){
	req.collection.find({}, {limit:10, sort: [['_id',-1]]}).toArray(function(error, results){
		if (error) return next(error);
		res.send(results);
	});								// req.collection.find().toArray
});									// app.get

app.post('/collections/:collectionName', function(req, res){
	req.collection.insert(req.body, {}, function(error, results){
		if (error) return next(error);
		res.send(results);
	});								// req.collection.insert
});									// app.post


app.get('/collections/:collectionName/:id', function(req, res){
	req.collection.findOne({_id: req.collection.id(req.params.id)}, function(error, result){
		if (error) return next(error);
		res.send(result);
	});								// req.collection.findOne
});									// app.get

app.put('/collections/:collectionName/:id', function(req, res) {
 	req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body},{safe: true, multi: false}, function(error, result){
		if (error) return next(error);
		res.send((result === 1)?{msg:'success'}:{msg:'error'});
	});								// req.collection.update
});									// app.put

app.del('/collections/:collectionName/:id', function(req, res){
	req.collection.remove({_id: req.collection.id(req.params.id)}, function(error, result){
		if (error) return next(error);
		res.send((result === 1)?{msg:'success'}:{msg:'error'});
	});								// req.collection.remove
});			

app.listen(3000);						// app.del