// load up the dependencies
var superagent = require('superagent');
var expect = require('expect.js');

/* here's a Mocha test script containing Superagent calls and Expect assertions

Mocha (http://visionmedia.github.io/mocha/):
	describe(<test suite description>, <test suite>)
	it(<test description>, <testfunction>(done?))
	done() // next test
	
Superagent(http://visionmedia.github.io/superagent/):
	.post(<url>)
	.send(<message>)
	.set(<header>)
	.end(<callback>)

Expect (https://github.com/LearnBoost/expect.js):
	expect(<expression>)
	.to.be.a(<type>)
	.to.be.ok() // truthy
	.to.be(<expression>) // === equality
	.to.eql(<expression>) // loose equality
	
*/

describe('express rest api server', function(){
	var id;
	
	it('post object', function(done){
		superagent.post('http://localhost:3000/collections/test')
		.send({name: 'John', email: 'aa@bb.cc'})
		.end(function(error, res){
			expect(error).to.eql(null);
			expect(res.body.length).to.eql(1);
			expect(res.body[0]._id.length).to.eql(24);
			id = res.body[0]._id;
			done();
		});			// .end
	});				// it
	
	it('retrieves an object', function(done){
		superagent.get('http://localhost:3000/collections/test/'+id)
		.end(function(error, res){
			expect(error).to.eql(null);
			expect(typeof res.body).to.eql('object');
			expect(res.body._id.length).to.eql(24);
			expect(res.body._id).to.eql(id);
			done();
		});			// .end
	});				// it
	
	it('retrieves a collection', function(done){
		superagent.get('http://localhost:3000/collections/test')
		.end(function(error, res){
			expect(error).to.eql(null);
			expect(res.body.length).to.be.above(0);
			//console.log('collection retrieved: ' + JSON.stringify(res.body));
			expect(res.body.map(function(item){return item._id;})).to.contain(id);
			done();
		});			// .end
	});				// it
	
	it('updates an object', function(done){
		superagent.put('http://localhost:3000/collections/test/'+id)
		.send({name: 'Peter', email: 'xx@yy.zz'})
		.end(function(error, res){
			expect(error).to.eql(null);
			expect(typeof res.body).to.eql('object');
			expect(res.body.msg).to.eql('success');
			done();
		});			// .end
	});				// it
	
	it('checks an updated object', function(done){
		superagent.get('http://localhost:3000/collections/test/'+id)
		.end(function(error, res){
			expect(error).to.eql(null);
			expect(typeof res.body).to.eql('object');
			expect(res.body._id.length).to.eql(24);
			expect(res.body._id).to.eql(id);
			expect(res.body.name).to.eql('Peter');
			done();
		});			// .end
	});				// it
	
	it('removes an object', function(done){
		superagent.del('http://localhost:3000/collections/test/'+id)
		.end(function(error, res){
			expect(error).to.eql(null);
			expect(typeof res.body).to.eql('object');
			expect(res.body.msg).to.eql('success');
			done();
		});			// .end
	});				// it			
});					// describe
	