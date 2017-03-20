
var index = require('../index');
var app = index.app;
var fibonacci = index.fibonacci;

var should = require('should');
var supertest = require('supertest');
var request = supertest(app);

describe('test/index.test.js', function(){
	
	describe('#fibonacci', function(){
		it('should throw when n is not a Number', function(){
			(function(){
				fibonacci('a');
			}).should.throw('n should be a Number');
		});
		it('should throw when n < 0', function(){
			(function(){
				fibonacci(-1);			
			}).should.throw('n should >= 0');
		});
		it('should throw when n > 30', function(){
			(function(){
				fibonacci(31);			
			}).should.throw('n should <= 30');
		});
	
		it('should return 0 when n === 0', function(){
				fibonacci(0).should.equal(0);
		});
		it('should return 1 when n === 1', function(){
				fibonacci(1).should.equal(1);
		});
		it('should equal 55 when n === 10', function(){
				fibonacci(10).should.equal(55);
		});
	});

	describe('GET /fib', function(){
		it('should throw when n is not a Number', function(done){
			 testFib('a', 500, 'n should be a Number', done);
		});
		it('should throw when n < 0', function(done){
			testFib(-1, 500, 'n should >= 0', done);
		})
		it('should throw when n > 30', function(done){
			testFib(31, 500, 'n should <= 30', done);
		})

		it('should return fib(0):0 when n === 0', function(done){
			testFib(0, 200, 'fib(0):0', done);
		})
		it('should return fib(1):1 when n === 1', function(done){
			testFib(1, 200, 'fib(1):1', done);
		})
		it('should return fib(10):55 when n === 10', function(done){
			testFib(10, 200, 'fib(10):55', done);
		})
	})
	
	describe('GET /topics', function(){
		this.timeout(20000);
		it('should return a json array', function(done){
			request.get('/topics')
				.expect(200)
				.end(function(err, res){
					should.exist(res);
					var arr = JSON.parse(res.text);
					arr.length.should.be.above(0);
					done(err);
				});	
		})
		
	})

});

var testFib  = function(n, statusCode, expect, done){
	request.get('/fib')
		.query({n:n})
		.expect(statusCode)
		.end(function(err, res){
			should.not.exist(err);
			res.text.should.equal(expect);
			done(err); //异步处理结束
		});
	
}
